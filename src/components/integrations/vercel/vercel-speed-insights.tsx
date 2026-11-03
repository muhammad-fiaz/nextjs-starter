"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";

export function VercelSpeedInsights(): ReactNode {
  return <SpeedInsights />;
}
