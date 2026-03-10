import React, { useEffect, useRef } from "react";

const FallBeamBackground = ({
  className = "",
  lineCount = 20,
  displayText,
  beamColorClass = "cyan-400",
}) => {
  const containerRef = useRef(null);

  const dynamicStyles = `
    .fall-beam-line {
      position: absolute;
      width: 1px;
      height: 100%;
      z-index: 10;
      background: rgba(255, 255, 255, 0.05); /* Garis halus statis */
    }

    .fall-beam-line::after {
      content: "";
      position: absolute;
      left: 0;
      width: 100%;
      height: 100px;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        var(--beam-glow-color),
        rgba(255, 255, 255, 0)
      );
      animation: fall var(--ani-duration) var(--ani-delay) linear infinite;
    }

    @keyframes fall {
      0% { top: -110px; }
      100% { top: 100%; }
    }
    `;

  const getColorValue = (colorClass) => {
    switch (colorClass) {
      case "green-400":
        return "rgba(74, 222, 128, 0.8)";
      case "cyan-400":
        return "rgba(34, 211, 238, 0.8)";
      case "blue-400":
        return "rgba(96, 165, 250, 0.8)";
      case "red-400":
        return "rgba(248, 113, 113, 0.8)";
      case "indigo-400":
        return "rgba(129, 140, 248, 0.8)";
      default:
        return "rgba(34, 211, 238, 0.8)";
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container
      .querySelectorAll(".fall-beam-line")
      .forEach((line) => line.remove());

    const glowColor = getColorValue(beamColorClass);

    for (let i = 1; i <= lineCount; i++) {
      const line = document.createElement("div");
      line.classList.add("fall-beam-line");

      const leftPosition = `${i * (100 / (lineCount + 1))}%`;
      const duration = 5 + Math.random() * 7 + "s";
      const delay = -Math.random() * 10 + "s";

      line.style.setProperty("left", leftPosition);
      line.style.setProperty("--ani-duration", duration);
      line.style.setProperty("--ani-delay", delay);
      line.style.setProperty("--beam-glow-color", glowColor);

      container.appendChild(line);
    }

    return () => {
      container
        .querySelectorAll(".fall-beam-line")
        .forEach((line) => line.remove());
    };
  }, [lineCount, beamColorClass]);

  return (
    <>
      <style>{dynamicStyles}</style>
      <div
        ref={containerRef}
        className={`absolute inset-0 z-0 overflow-hidden bg-transparent pointer-events-none ${className}`}
      >
        {displayText && (
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white tracking-tighter">
              {displayText}
            </h1>
            <div
              className="absolute inset-0 z-30 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4) 100%)",
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default FallBeamBackground;
