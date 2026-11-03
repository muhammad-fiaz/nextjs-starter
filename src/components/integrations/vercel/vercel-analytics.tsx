"use client";

import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";

export function VercelAnalytics(): ReactNode {
  return <Analytics />;
}
