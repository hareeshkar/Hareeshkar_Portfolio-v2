// --- Device capability detection ---
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const isLowEndDevice = navigator.hardwareConcurrency <= 4 || isMobile;

// --- LRU Cache Implementation with memory optimization ---
class UltraLRUCache {
  constructor(maxSize = 40) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessCount = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (item) {
      this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);
      this.cache.delete(key);
      this.cache.set(key, item);
    }
    return item;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      let leastUsed = null;
      let minAccess = Infinity;
      for (const [k, access] of this.accessCount) {
        if (access < minAccess) {
          minAccess = access;
          leastUsed = k;
        }
      }
      if (leastUsed) {
        this.cache.delete(leastUsed);
        this.accessCount.delete(leastUsed);
      }
    }
    this.cache.set(key, value);
    this.accessCount.set(key, 1);
  }

  has(key) {
    return this.cache.has(key);
  }

  // Add cleanup method
  clear() {
    this.cache.clear();
    this.accessCount.clear();
  }
}

// Priority queue for processing order
class PriorityQueue {
  constructor() {
    this.high = new Set(); // Visible items
    this.normal = new Set(); // Near viewport
    this.low = new Set(); // Background preload
  }

  addHigh(item) {
    this.normal.delete(item);
    this.low.delete(item);
    this.high.add(item);
  }

  addNormal(item) {
    if (!this.high.has(item)) {
      this.low.delete(item);
      this.normal.add(item);
    }
  }

  addLow(item) {
    if (!this.high.has(item) && !this.normal.has(item)) {
      this.low.add(item);
    }
  }

  getNext() {
    if (this.high.size > 0) {
      const item = this.high.values().next().value;
      this.high.delete(item);
      return item;
    }
    if (this.normal.size > 0) {
      const item = this.normal.values().next().value;
      this.normal.delete(item);
      return item;
    }
    if (this.low.size > 0) {
      const item = this.low.values().next().value;
      this.low.delete(item);
      return item;
    }
    return null;
  }

  get size() {
    return this.high.size + this.normal.size + this.low.size;
  }
}

// --- Multi-Worker Pool ---
const WORKER_COUNT = Math.min(
  navigator.hardwareConcurrency || 2,
  isLowEndDevice ? 2 : 3
);
let workerPool = [];
let workerIndex = 0;
let requestCounter = 0;
const pendingRequests = new Map();
const priorityQueue = new PriorityQueue();

const initWorkerPool = () => {
  if (typeof Worker === "undefined" || workerPool.length > 0) return;

  // Create inline worker code
  const workerCode = `
    // Worker-scoped device detection
    let isLowEndDevice = false;

    // Metallic Icon Processing (Simple Alpha Inversion)
    function processMetallicIconOnWorker(imageBitmap, maxSize = 128) {
      return new Promise((resolve) => {
        let width = imageBitmap.width;
        let height = imageBitmap.height;

        // Downscale if needed
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Use OffscreenCanvas for rendering
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext("2d", {
          willReadFrequently: true,
          alpha: true,
        });

        ctx.drawImage(imageBitmap, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Alpha inversion for metallic shader
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i + 3];
        }

        resolve({ imageData });
      });
    }

    // Logo Processing with Distance Field (for SkillIcon)
    function parseLogoImageOnWorker(imageBitmap) {
      return new Promise((resolve) => {
        const MAX_SIZE = isLowEndDevice ? 224 : 320;
        const MIN_SIZE = isLowEndDevice ? 112 : 160;
        let width = imageBitmap.width;
        let height = imageBitmap.height;

        const ratio = width / height;
        if (width > MAX_SIZE || height > MAX_SIZE || width < MIN_SIZE || height < MIN_SIZE) {
          if (ratio > 1) {
            width = Math.max(MIN_SIZE, Math.min(MAX_SIZE, width));
            height = Math.round(width / ratio);
          } else {
            height = Math.max(MIN_SIZE, Math.min(MAX_SIZE, height));
            width = Math.round(height * ratio);
          }
        }

        width = (width >> 2) << 2;
        height = (height >> 2) << 2;

        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext("2d", { willReadFrequently: true, alpha: true });
        
        ctx.imageSmoothingEnabled = !isLowEndDevice;
        ctx.imageSmoothingQuality = "low";
        ctx.drawImage(imageBitmap, 0, 0, width, height);

        const shapeImageData = ctx.getImageData(0, 0, width, height);
        const data = shapeImageData.data;
        const length = width * height;
        const shapeMask = new Uint8Array(length);

        // Create shape mask
        for (let i = 0; i < length; i++) {
          shapeMask[i] = data[(i << 2) + 3] > 20 ? 1 : 0;
        }

        // Create boundary mask
        const boundaryMask = new Uint8Array(length);
        for (let y = 1; y < height - 1; y++) {
          const yOffset = y * width;
          for (let x = 1; x < width - 1; x++) {
            const idx = yOffset + x;
            if (shapeMask[idx] && (!shapeMask[idx - 1] || !shapeMask[idx + 1] || 
                !shapeMask[idx - width] || !shapeMask[idx + width])) {
              boundaryMask[idx] = 1;
            }
          }
        }

        // Distance field calculation
        let u = new Float32Array(length);
        let newU = new Float32Array(length);
        u.fill(0);

        const C = 0.01;
        const ITERATIONS = isLowEndDevice ? 40 : 65;
        const getU = (idx, arr) => (shapeMask[idx] ? arr[idx] : 0);

        for (let iter = 0; iter < ITERATIONS; iter++) {
          for (let i = 0; i < length; i++) {
            if (!shapeMask[i] || boundaryMask[i]) {
              newU[i] = 0;
              continue;
            }
            const x = i % width;
            const y = (i / width) | 0;
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) continue;

            const sumN = getU(i + 1, u) + getU(i - 1, u) + getU(i + width, u) + getU(i - width, u);
            newU[i] = (C + sumN) * 0.25;
          }
          [u, newU] = [newU, u];
        }

        // Find max value
        let maxVal = 0;
        for (let i = 0; i < length; i++) {
          if (u[i] > maxVal) maxVal = u[i];
        }

        // Create output image
        const invMaxVal = maxVal > 0 ? 1 / maxVal : 0;
        const outImg = ctx.createImageData(width, height);
        const outData = outImg.data;
        const ALPHA = 2.0;

        for (let i = 0; i < length; i++) {
          const px = i << 2;
          if (!shapeMask[i]) {
            outData[px] = outData[px + 1] = outData[px + 2] = outData[px + 3] = 255;
          } else {
            const normalized = u[i] * invMaxVal;
            const gray = (255 * (1 - Math.pow(normalized, ALPHA))) | 0;
            outData[px] = outData[px + 1] = outData[px + 2] = gray;
            outData[px + 3] = 255;
          }
        }

        ctx.putImageData(outImg, 0, 0);
        canvas.convertToBlob({ type: "image/png", quality: 0.75 }).then((blob) => {
          resolve({ imageData: outImg, pngBlob: blob });
        });
      });
    }

    // Worker Message Handler
    self.onmessage = async (e) => {
      const { id, imageBitmap, isLowEnd, mode, maxSize } = e.data;
      isLowEndDevice = isLowEnd;

      if (!imageBitmap) {
        self.postMessage({ id, error: "No ImageBitmap received in worker." });
        return;
      }

      try {
        let parsedData;

        if (mode === "metallic") {
          parsedData = await processMetallicIconOnWorker(imageBitmap, maxSize || 128);
        } else {
          parsedData = await parseLogoImageOnWorker(imageBitmap);
        }

        imageBitmap.close();
        self.postMessage({ id, payload: parsedData }, [parsedData.imageData.data.buffer]);
      } catch (error) {
        imageBitmap.close();
        self.postMessage({ id, error: \`Worker processing failed: \${error.message}\` });
      }
    };
  `;

  // Create inline worker from Blob
  const blob = new Blob([workerCode], { type: "application/javascript" });
  const workerUrl = URL.createObjectURL(blob);

  for (let i = 0; i < WORKER_COUNT; i++) {
    const worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
      const { id, payload, error } = e.data;
      const request = pendingRequests.get(id);
      if (request) {
        if (error) {
          request.reject(new Error(error));
        } else {
          request.resolve(payload);
        }
        pendingRequests.delete(id);
      }
    };

    worker.onerror = (e) => {
      console.error(`Worker ${i} error:`, e);
    };

    workerPool.push(worker);
  }

  // Clean up blob URL after workers are created
  URL.revokeObjectURL(workerUrl);
};

// Lazy init on first use
let workerInitialized = false;
const ensureWorker = () => {
  if (!workerInitialized) {
    initWorkerPool();
    workerInitialized = true;
  }
};

export const globalImageCache = new UltraLRUCache(isLowEndDevice ? 35 : 45);

// Optimized SVG rasterization with better error handling
const rasterizeSvg = (svgUrl, targetSize = isLowEndDevice ? 192 : 256) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    const timeout = setTimeout(() => {
      img.src = "";
      reject(new Error(`Timeout loading: ${svgUrl}`));
    }, 10000);

    img.onload = async () => {
      clearTimeout(timeout);
      try {
        const isSVG = svgUrl.toLowerCase().endsWith(".svg");
        const resizeOptions = {
          premultiplyAlpha: "premultiply",
          colorSpaceConversion: "none",
          resizeQuality: isLowEndDevice ? "pixelated" : "low",
          imageOrientation: "none",
        };

        // Always provide dimensions for SVGs to handle dimension-less SVGs
        if (isSVG) {
          resizeOptions.resizeWidth = targetSize;
          resizeOptions.resizeHeight = targetSize;
        }

        const imageBitmap = await createImageBitmap(img, resizeOptions);
        resolve(imageBitmap);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load image from URL: ${svgUrl}`));
    };

    img.src = svgUrl;
  });
};

const workerRequest = (imageBitmap, mode = "default", maxSize) => {
  return new Promise((resolve, reject) => {
    if (workerPool.length === 0) {
      return reject(new Error("Worker pool not initialized."));
    }

    // Round-robin worker selection
    const worker = workerPool[workerIndex];
    workerIndex = (workerIndex + 1) % workerPool.length;

    const id = requestCounter++;
    pendingRequests.set(id, { resolve, reject });

    worker.postMessage(
      {
        id,
        imageBitmap,
        isLowEnd: isLowEndDevice,
        mode,
        maxSize,
      },
      [imageBitmap]
    );
  });
};

// --- processIcon function (REVISED AGAIN FOR ROBUSTNESS) ---
export const processIcon = async (iconSrc, priority = "normal") => {
  if (!iconSrc) throw new Error("No icon source provided.");

  const cachedData = globalImageCache.get(iconSrc);
  if (cachedData) return cachedData;

  ensureWorker(); // Lazy init

  try {
    const imageBitmap = await rasterizeSvg(iconSrc);
    const result = await workerRequest(imageBitmap, "default");
    globalImageCache.set(iconSrc, result);
    return result;
  } catch (error) {
    console.error(`Error processing icon ${iconSrc}:`, error);
    throw error;
  }
};

// --- processMetallicIcon: Worker-based processing for metallic shader icons ---
export const processMetallicIcon = async (
  iconSrc,
  maxSize = isLowEndDevice ? 64 : 96
) => {
  if (!iconSrc) throw new Error("No icon source provided.");

  const cacheKey = `metallic_${maxSize}_${iconSrc}`;
  const cachedData = globalImageCache.get(cacheKey);
  if (cachedData) return cachedData;

  ensureWorker(); // Lazy init

  try {
    const isSVG = iconSrc.toLowerCase().endsWith(".svg");

    // Load image with timeout
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";

      const timeout = setTimeout(() => {
        reject(new Error(`Image load timeout: ${iconSrc}`));
      }, 5000);

      image.onload = () => {
        clearTimeout(timeout);
        resolve(image);
      };

      image.onerror = (err) => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load image: ${iconSrc}`));
      };

      image.src = iconSrc;
    });

    // Create ImageBitmap for transfer to worker
    // Always provide resize options for SVGs to handle dimension-less SVGs
    const bitmapOptions = {
      premultiplyAlpha: "premultiply",
      colorSpaceConversion: "none",
      resizeQuality: isLowEndDevice ? "pixelated" : "medium",
    };

    // For SVGs, always specify dimensions to handle dimension-less SVGs
    if (isSVG) {
      bitmapOptions.resizeWidth = maxSize;
      bitmapOptions.resizeHeight = maxSize;
    }

    const imageBitmap = await createImageBitmap(img, bitmapOptions);

    // Process in worker with metallic mode
    const result = await workerRequest(imageBitmap, "metallic", maxSize);

    // Cache the result
    globalImageCache.set(cacheKey, result.imageData);
    return result.imageData;
  } catch (error) {
    console.error(`Error processing metallic icon ${iconSrc}:`, error);
    throw error;
  }
};

// Ultra-optimized preload system with priority batching
const preloadQueue = priorityQueue;
let isProcessingQueue = false;
let queueScheduled = false;

export const preloadIcons = (iconSources, priority = "low") => {
  iconSources.forEach((src) => {
    if (!globalImageCache.has(src)) {
      switch (priority) {
        case "high":
          preloadQueue.addHigh(src);
          break;
        case "normal":
          preloadQueue.addNormal(src);
          break;
        default:
          preloadQueue.addLow(src);
      }
    }
  });

  if (!isProcessingQueue && !queueScheduled) {
    queueScheduled = true;
    processPreloadQueue();
  }
};

const processPreloadQueue = () => {
  if (preloadQueue.size === 0) {
    isProcessingQueue = false;
    queueScheduled = false;
    return;
  }
  isProcessingQueue = true;

  const processNext = (deadline) => {
    const timePerIcon = isLowEndDevice ? 2 : 4;
    const maxBatch = isLowEndDevice ? 2 : 4; // Reduced for better distribution
    let processed = 0;

    while (
      (deadline.timeRemaining() > timePerIcon || deadline.didTimeout) &&
      preloadQueue.size > 0 &&
      processed < maxBatch
    ) {
      const iconSrc = preloadQueue.getNext();
      if (!iconSrc) break;

      processIcon(iconSrc).catch((err) =>
        console.warn(`Preload failed for ${iconSrc}:`, err)
      );
      processed++;
    }

    if (preloadQueue.size > 0) {
      requestIdleCallback(processNext, {
        timeout: isLowEndDevice ? 800 : 1000, // Reduced timeout
      });
    } else {
      isProcessingQueue = false;
      queueScheduled = false;
    }
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(processNext, { timeout: isLowEndDevice ? 800 : 1000 });
  } else {
    setTimeout(
      () => processNext({ timeRemaining: () => 16, didTimeout: true }),
      25
    );
  }
};

// Visible priority processing for immediate loading
export const processIconHighPriority = (iconSrc) => {
  preloadQueue.addHigh(iconSrc);
  if (!isProcessingQueue) {
    processPreloadQueue();
  }
  return processIcon(iconSrc, "high");
};

// Cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener(
    "beforeunload",
    () => {
      globalImageCache.clear();
      workerPool.forEach((worker) => worker.terminate());
      workerPool = [];
    },
    { once: true }
  );
}
