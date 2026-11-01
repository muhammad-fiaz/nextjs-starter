"use client";

import { useEffect, useRef } from "react";

import { registerWebMCPTool } from "@/lib/webmcp/registry";
import type { WebMCPTool } from "@/types/webmcp";

export function useWebMCPTool<TInput = Record<string, unknown>, TOutput = unknown>(
  tool: WebMCPTool<TInput, TOutput>,
  deps: React.DependencyList = [],
): void {
  const toolRef = useRef(tool);
  toolRef.current = tool;

  useEffect(() => {
    const unregister = registerWebMCPTool<TInput, TOutput>({
      name: toolRef.current.name,
      description: toolRef.current.description,
      inputSchema: toolRef.current.inputSchema,
      annotations: toolRef.current.annotations,
      execute: (input: TInput, context) => toolRef.current.execute(input, context),
    });

    return () => {
      unregister();
    };
  }, deps);
}
