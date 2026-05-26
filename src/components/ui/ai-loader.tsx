import * as React from "react";

interface LoaderProps {
  size?: number;
  text?: string;
}

export const AiLoader: React.FC<LoaderProps> = ({ size = 180, text = "Generating" }) => {
  const letters = text.split("");

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block text-white opacity-40 animate-loaderLetter"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {letter}
        </span>
      ))}
      <div className="absolute inset-0 rounded-full animate-loaderCircle" />
    </div>
  );
};
