"use client";
import "./image-ai-loader.css";

export default function ImageAILoader() {
  return (
    <div
      role="img"
      aria-label="Hamster running in a wheel"
      className="image-ai-wheel-and-hamster"
    >
      <div className="image-ai-wheel"></div>

      <div className="image-ai-hamster">
        <div className="image-ai-hamster__body">
          <div className="image-ai-hamster__head">
            <div className="image-ai-hamster__ear" />
            <div className="image-ai-hamster__eye" />
            <div className="image-ai-hamster__nose" />
          </div>

          <div className="image-ai-hamster__limb image-ai-hamster__limb--fr" />
          <div className="image-ai-hamster__limb image-ai-hamster__limb--fl" />
          <div className="image-ai-hamster__limb image-ai-hamster__limb--br" />
          <div className="image-ai-hamster__limb image-ai-hamster__limb--bl" />

          <div className="image-ai-hamster__tail" />
        </div>
      </div>

      <div className="image-ai-spoke"></div>
    </div>
  );
}
