"use client";

import type { ModelContext, WebMCPRegisterOptions, WebMCPTool } from "@/types/webmcp";

class InMemoryModelContext implements ModelContext {
  private tools: Map<string, WebMCPTool<any, any>> = new Map();

  public registerTool(
    tool: WebMCPTool<any, any>,
    options?: WebMCPRegisterOptions,
  ): Promise<void> | void {
    this.tools.set(tool.name, tool);

    if (options?.signal) {
      if (options.signal.aborted) {
        this.unregisterTool(tool.name);
        return;
      }
      options.signal.addEventListener(
        "abort",
        () => {
          this.unregisterTool(tool.name);
        },
        { once: true },
      );
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("webmcp:tool-registered", {
          detail: { toolName: tool.name },
        }),
      );
    }
  }

  public unregisterTool(toolName: string): void {
    if (this.tools.has(toolName)) {
      this.tools.delete(toolName);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("webmcp:tool-unregistered", {
            detail: { toolName },
          }),
        );
      }
    }
  }

  public getTools(): WebMCPTool<any, any>[] {
    return Array.from(this.tools.values());
  }

  public hasTool(toolName: string): boolean {
    return this.tools.has(toolName);
  }
}

const activeControllers: Map<string, AbortController> = new Map();

export function ensureModelContext(): ModelContext | null {
  if (typeof document === "undefined") {
    return null;
  }

  if (!document.modelContext) {
    document.modelContext = new InMemoryModelContext();
  }

  return document.modelContext;
}

export function registerWebMCPTool<TInput = Record<string, unknown>, TOutput = unknown>(
  tool: WebMCPTool<TInput, TOutput>,
): () => void {
  const context = ensureModelContext();
  if (!context) {
    return () => {};
  }

  const existingController = activeControllers.get(tool.name);
  if (existingController) {
    try {
      existingController.abort();
    } catch {}
    activeControllers.delete(tool.name);
  }

  const controller = new AbortController();
  activeControllers.set(tool.name, controller);

  try {
    const result = context.registerTool(tool, { signal: controller.signal });
    if (result && typeof (result as Promise<void>).catch === "function") {
      (result as Promise<void>).catch((err: unknown) => {
        const errorName = (err as { name?: string })?.name;
        const message = err instanceof Error ? err.message : String(err);
        if (
          errorName === "AbortError" ||
          errorName === "InvalidStateError" ||
          message.includes("Duplicate tool name")
        ) {
          return;
        }
        console.warn(`[WebMCP] Failed to register tool "${tool.name}":`, err);
      });
    }
  } catch (err: unknown) {
    const errorName = (err as { name?: string })?.name;
    const message = err instanceof Error ? err.message : String(err);
    if (
      errorName === "AbortError" ||
      errorName === "InvalidStateError" ||
      message.includes("Duplicate tool name")
    ) {
    } else {
      console.warn(`[WebMCP] Failed to register tool "${tool.name}":`, err);
    }
  }

  return () => {
    try {
      controller.abort();
    } catch {}
    if (activeControllers.get(tool.name) === controller) {
      activeControllers.delete(tool.name);
    }
    if (context.unregisterTool) {
      try {
        context.unregisterTool(tool.name);
      } catch {}
    }
  };
}
