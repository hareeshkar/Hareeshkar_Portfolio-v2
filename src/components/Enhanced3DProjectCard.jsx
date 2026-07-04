import React from "react";
import {
  Enhanced3DCardContainer,
  Enhanced3DCardBody,
  Enhanced3DCardItem,
} from "./Enhanced3DCard";
import RenderEffect from "./gallery/RenderEffect";
import MaterialTooltip from "./gallery/MaterialTooltip";
import TextScramble from "./TextScramble";

const Enhanced3DProjectCard = ({
  title,
  description,
  techStack = [],
  image,
  liveLink,
  githubLink,
  index = 1,
}) => {
  return (
    <Enhanced3DCardContainer
      className="w-full h-full"
      perspective="1800px"
      sensitivity={0.04}
      rotationStrength={{ x: 1.0, y: 1.5 }}
    >
      <Enhanced3DCardBody className="bg-surface relative group/card dark:hover:shadow-2xl dark:hover:shadow-accent/[0.1] border border-border/30 w-full h-[600px] rounded-2xl p-4 hover:border-accent/50 transition-colors duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-accent/20">
        {/* Enhanced Project Index with 3D depth */}
        <Enhanced3DCardItem
          translateZ={60}
          rotateY={5}
          scale={1.1}
          className="absolute -top-4 -left-4 w-12 h-12 bg-accent text-surface rounded-full flex items-center justify-center font-display font-bold text-lg z-10 shadow-lg"
        >
          {String(index).padStart(2, "0")}
        </Enhanced3DCardItem>

        {/* Title with enhanced 3D */}
        <Enhanced3DCardItem
          translateZ={80}
          rotateX={-2}
          className="text-xl font-bold text-text-primary font-display mb-3 line-clamp-2"
        >
          {title}
        </Enhanced3DCardItem>

        {/* Description with depth */}
        <Enhanced3DCardItem
          as="p"
          translateZ={50}
          rotateX={1}
          className="text-text-secondary text-sm mb-4 leading-relaxed flex-grow line-clamp-4"
        >
          {description}
        </Enhanced3DCardItem>

        {/* Project Image with enhanced parallax and render effect */}
        <Enhanced3DCardItem
          translateZ={70}
          rotateY={-3}
          scale={1.02}
          className="w-full mb-4"
        >
          <div className="h-48 w-full rounded-xl overflow-hidden shadow-inner">
            <RenderEffect
              colorImage={image}
              alt={title}
              className="w-full h-full"
              renderOnHover={true}
              transitionDuration={1.2}
            />
          </div>
        </Enhanced3DCardItem>

        {/* Tech Stack with staggered depth, enhanced hover, and Material tooltips */}
        {techStack.length > 0 && (
          <Enhanced3DCardItem
            translateZ={40}
            className="flex flex-wrap gap-2 mb-4 min-h-[60px] items-start"
          >
            {techStack.slice(0, 4).map((tech, i) => (
              <Enhanced3DCardItem
                key={tech}
                translateZ={20 + i * 5}
                rotateY={i * 3}
                scale={1.05}
                className="px-4 py-2 bg-surface-secondary border border-border rounded-full text-xs hover:bg-accent/10 transition-all duration-200"
              >
                <MaterialTooltip techName={tech} delay={0.5}>
                  <TextScramble
                    as="span"
                    text={tech}
                    className="font-medium cursor-help"
                  />
                </MaterialTooltip>
              </Enhanced3DCardItem>
            ))}
            {techStack.length > 4 && (
              <Enhanced3DCardItem
                translateZ={45}
                rotateY={12}
                className="px-4 py-2 bg-surface-secondary border border-border rounded-full text-xs font-medium text-text-secondary"
              >
                +{techStack.length - 4}
              </Enhanced3DCardItem>
            )}
          </Enhanced3DCardItem>
        )}

        {/* Action Buttons with enhanced 3D */}
        <div className="flex justify-between items-center mt-auto pt-4">
          {liveLink && (
            <Enhanced3DCardItem
              translateZ={60}
              rotateX={-3}
              as="a"
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-normal text-text-secondary hover:text-accent transition-colors hover:bg-accent/5"
            >
              View Live →
            </Enhanced3DCardItem>
          )}
          {githubLink && (
            <Enhanced3DCardItem
              translateZ={60}
              rotateX={3}
              as="a"
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-accent text-surface text-xs font-bold hover:bg-accent/90 transition-colors shadow-md hover:shadow-lg"
            >
              View Code
            </Enhanced3DCardItem>
          )}
        </div>
      </Enhanced3DCardBody>
    </Enhanced3DCardContainer>
  );
};

export default Enhanced3DProjectCard;
