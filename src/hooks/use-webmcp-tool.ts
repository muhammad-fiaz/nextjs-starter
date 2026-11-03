import { useEffect, useRef } from "react";

import { registerWebMCPTool } from "@/lib/webmcp/registry";
import type { WebMCPTool } from "@/types/webmcp";

/**
 * Registers a WebMCP tool for the lifetime of the calling component.
 *
 * The tool object is read through a ref, so changing handlers or state does not
 * require re-registering. Only a new tool name replaces the registration.
 */
export function useWebMCPTool<TInput = Record<string, unknown>, TOutput = unknown>(
  tool: WebMCPTool<TInput, TOutput>,
): void {
  const toolRef = useRef(tool);
  toolRef.current = tool;

  useEffect(() => {
    const current = toolRef.current;

    return registerWebMCPTool<TInput, TOutput>({
      name: current.name,
      description: current.description,
      inputSchema: current.inputSchema,
      annotations: current.annotations,
      execute: (input: TInput, context) => toolRef.current.execute(input, context),
    });
  }, []);
}
