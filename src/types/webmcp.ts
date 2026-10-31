/**
 * WebMCP (Web Model Context Protocol) Type Definitions
 * Based on Google Chrome WebMCP Imperative & Declarative API Specification
 */

export interface WebMCPAnnotations {
  /**
   * Indicates whether the tool performs only read operations without mutating state.
   */
  readOnlyHint?: boolean;
  /**
   * Indicates whether the tool execution has consequences (destructive, external mutation, payment).
   */
  consequentialHint?: boolean;
  /**
   * Indicates whether the tool accepts or handles untrusted content.
   */
  untrustedContentHint?: boolean;
  /**
   * Optional debugging or telemetry flag for agent execution.
   */
  debugging?: boolean;
}

export interface WebMCPPropertySchema {
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
  enum?: string[];
  items?: WebMCPPropertySchema;
  properties?: Record<string, WebMCPPropertySchema>;
  required?: string[];
}

export interface WebMCPInputSchema {
  type: "object";
  properties: Record<string, WebMCPPropertySchema>;
  required?: string[];
}

export interface WebMCPToolExecutionContext {
  signal?: AbortSignal;
}

export interface WebMCPTool<TInput = Record<string, unknown>, TOutput = unknown> {
  name: string;
  description: string;
  inputSchema?: WebMCPInputSchema;
  annotations?: WebMCPAnnotations;
  execute: (input: TInput, context?: WebMCPToolExecutionContext) => Promise<TOutput> | TOutput;
}

export interface WebMCPRegisterOptions {
  signal?: AbortSignal;
}

export interface ModelContext {
  registerTool: (
    tool: WebMCPTool<any, any>,
    options?: WebMCPRegisterOptions,
  ) => Promise<void> | void;
  unregisterTool?: (toolName: string) => void;
  getTools?: () => WebMCPTool<any, any>[];
  hasTool?: (toolName: string) => boolean;
}

declare global {
  interface Document {
    modelContext?: ModelContext;
  }

  interface GlobalEventHandlersEventMap {
    agentInvoked: CustomEvent<{
      toolName: string;
      parameters: Record<string, unknown>;
      respondWith: (response: Promise<unknown> | unknown) => void;
    }>;
  }
}
