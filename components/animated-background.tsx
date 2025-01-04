import { useMemo } from "react";

export default function AnimatedBackground(): JSX.Element {
  // Pre-calculate random positions and delays for each triangle
  const triangles = useMemo(
    () =>
      [...Array(30)].map(() => ({
        position: getRandomPosition(),
        delay: Math.random() * 15,
        duration: 15 + Math.random() * 10, // Varying durations between 15-25s
        // Random initial transform to ensure scattered start
        initialX: Math.random() * 100 - 50, // -50px to 50px
        initialY: Math.random() * 100 - 50, // -50px to 50px
      })),
    []
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black">
        {triangles.map((triangle, i) => (
          <div
            key={i}
            className={`
              absolute animate-float-random
              before:absolute before:content-[''] before:w-0 before:h-0
              before:border-l-[20px] before:border-l-transparent
              before:border-r-[20px] before:border-r-transparent
              before:border-b-[30px] before:border-b-purple-500/20
              ${triangle.position}
            `}
            style={{
              animationDelay: `${triangle.delay}s`,
              animationDuration: `${triangle.duration}s`,
              transform: `translate(${triangle.initialX}px, ${triangle.initialY}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function getRandomPosition(): string {
  const positions = [
    "-top-20 -left-20",
    "-top-20 left-1/4",
    "-top-20 left-1/2",
    "-top-20 left-3/4",
    "-top-20 -right-20",
    "top-1/4 -left-20",
    "top-1/4 left-1/4",
    "top-1/4 left-1/2",
    "top-1/4 left-3/4",
    "top-1/4 -right-20",
    "top-1/2 -left-20", // Added more positions for better distribution
    "top-1/2 left-1/4",
    "top-1/2 left-1/2",
    "top-1/2 left-3/4",
    "top-1/2 -right-20",
  ];
  return positions[Math.floor(Math.random() * positions.length)];
}
