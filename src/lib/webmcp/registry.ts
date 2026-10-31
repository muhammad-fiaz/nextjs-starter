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

// Active controllers tracking per tool name for React HMR and component lifecycle
const activeControllers: Map<string, AbortController> = new Map();

/**
 * Initializes document.modelContext polyfill/runtime if not already present.
 */
export function ensureModelContext(): ModelContext | null {
  if (typeof document === "undefined") {
    return null;
  }

  if (!document.modelContext) {
    document.modelContext = new InMemoryModelContext();
  }

  return document.modelContext;
}

/**
 * Imperatively registers a WebMCP tool on document.modelContext.
 * Adheres strictly to the Chrome WebMCP specification:
 * - Controls lifecycle via AbortSignal to prevent and resolve InvalidStateError: Duplicate tool name.
 * - Catches rejected promises safely so unhandledRejection is never thrown.
 * - Returns an unregister function for component unmount / cleanup.
 */
export function registerWebMCPTool<TInput = Record<string, unknown>, TOutput = unknown>(
  tool: WebMCPTool<TInput, TOutput>,
): () => void {
  const context = ensureModelContext();
  if (!context) {
    return () => {};
  }

  // 1. If an active AbortController exists for this tool name, abort it to clean up previous registration
  const existingController = activeControllers.get(tool.name);
  if (existingController) {
    try {
      existingController.abort();
    } catch {
      // Ignore abort errors
    }
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
          // Gracefully handled duplicate or aborted tool registration in Chrome WebMCP
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
      // Ignore expected duplicate in browser context
    } else {
      console.warn(`[WebMCP] Failed to register tool "${tool.name}":`, err);
    }
  }

  return () => {
    try {
      controller.abort();
    } catch {
      // Ignore abort errors on cleanup
    }
    if (activeControllers.get(tool.name) === controller) {
      activeControllers.delete(tool.name);
    }
    if (context.unregisterTool) {
      try {
        context.unregisterTool(tool.name);
      } catch {
        // Safe catch on cleanup
      }
    }
  };
}
