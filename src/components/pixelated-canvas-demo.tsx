"use client";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

export default function PixelatedCanvasDemo() {
  return (
    <div className="mx-auto mt-8">
      <PixelatedCanvas
        src="https://assets.aceternity.com/manu-red.png"
        width={400}
        height={500}
        cellSize={3}
        dotScale={0.9}
        shape="square"
        backgroundColor="#000000"
        dropoutStrength={0.4}
        interactive
        distortionStrength={3}
        distortionRadius={80}
        distortionMode="swirl"
        followSpeed={0.2}
        jitterStrength={4}
        jitterSpeed={4}
        sampleAverage
        tintColor="#FFFFFF"
        tintStrength={0.2}
        className="rounded-xl border border-neutral-800 shadow-lg"
      />
    </div>
  );
}
