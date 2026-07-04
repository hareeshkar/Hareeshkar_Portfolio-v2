import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  createContext,
  useContext,
} from "react";
import { gsap } from "gsap";

// Context for mouse enter state
const MouseEnterContext = createContext(undefined);

export const Enhanced3DCardContainer = ({
  children,
  className = "",
  containerClassName = "",
  perspective = "1500px", // Increased for more dramatic 3D
  sensitivity = 0.02, // New prop for sensitivity control
  rotationStrength = { x: 1, y: 1.8 }, // New prop to control rotation strength, emphasizing Y-axis
  ...props
}) => {
  const containerRef = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const rafRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const { left, top, width, height } =
          containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) * sensitivity;
        const y = (e.clientY - top - height / 2) * sensitivity;

        // Calculate velocity for smoother transitions
        velocityRef.current.x = (x - lastMousePos.current.x) * 0.1;
        velocityRef.current.y = (y - lastMousePos.current.y) * 0.1;
        lastMousePos.current = { x, y };

        // Enhanced 3D with stronger Y-axis rotation for left/right effect
        gsap.to(containerRef.current, {
          rotationY: x * rotationStrength.y, // Emphasized Y-axis for left/right
          rotationX: -y * rotationStrength.x,
          duration: 0.15, // Slightly longer for smoothness
          ease: "power2.out",
        });
      });
    },
    [sensitivity, rotationStrength]
  );

  const handleMouseEnter = useCallback(() => {
    setIsMouseEntered(true);
    // Add subtle scale effect on enter
    gsap.to(containerRef.current, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsMouseEntered(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Smooth return with scale reset
    gsap.to(containerRef.current, {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={`flex items-center justify-center ${containerClassName}`}
        style={{ perspective }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative transition-all duration-200 ease-linear ${className}`}
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const Enhanced3DCardBody = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`w-full h-full ${className}`}
      style={{
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Enhanced3DCardItem = ({
  as: Tag = "div",
  children,
  className = "",
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scale = 1,
  ...rest
}) => {
  const ref = useRef(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    if (!ref.current) return;

    if (isMouseEntered) {
      gsap.to(ref.current, {
        x: translateX,
        y: translateY,
        z: translateZ,
        rotationX: rotateX,
        rotationY: rotateY,
        rotationZ: rotateZ,
        scale: scale,
        duration: 0.4, // Slightly longer for depth
        ease: "power2.out",
      });
    } else {
      gsap.to(ref.current, {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
      });
    }
  }, [
    isMouseEntered,
    translateX,
    translateY,
    translateZ,
    rotateX,
    rotateY,
    rotateZ,
    scale,
  ]);

  return (
    <Tag
      ref={ref}
      className={`w-fit transition-all duration-200 ease-linear ${className}`}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Hook to use the mouse enter context
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error(
      "useMouseEnter must be used within a Enhanced3DCardContainer"
    );
  }
  return context;
};
