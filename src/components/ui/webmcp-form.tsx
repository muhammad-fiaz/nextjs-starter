"use client";

import { type FormHTMLAttributes, type ReactNode, useEffect, useRef } from "react";

interface WebMCPFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  toolname: string;
  tooldescription: string;
  toolautosubmit?: boolean;
  onAgentSubmit?: (
    values: Record<string, unknown>,
    event: CustomEvent<{
      toolName: string;
      parameters: Record<string, unknown>;
      respondWith: (response: Promise<unknown> | unknown) => void;
    }>,
  ) => Promise<unknown> | unknown;
}

export function WebMCPForm({
  children,
  toolname,
  tooldescription,
  toolautosubmit = false,
  onAgentSubmit,
  ...props
}: WebMCPFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const formElement = formRef.current;
    if (!formElement) return;

    const handleAgentInvoked = async (e: Event) => {
      const customEvent = e as CustomEvent<{
        toolName: string;
        parameters: Record<string, unknown>;
        respondWith: (response: Promise<unknown> | unknown) => void;
      }>;

      if (customEvent.detail.toolName !== toolname) return;

      if (onAgentSubmit) {
        try {
          const result = await onAgentSubmit(customEvent.detail.parameters, customEvent);
          customEvent.detail.respondWith(result);
        } catch (error) {
          customEvent.detail.respondWith({
            error: error instanceof Error ? error.message : "Unknown form submission error",
          });
        }
      } else {
        const formData = new FormData(formElement);
        const entries: Record<string, unknown> = {};
        formData.forEach((value, key) => {
          entries[key] = value;
        });
        customEvent.detail.respondWith({ success: true, data: entries });
      }
    };

    formElement.addEventListener("agentInvoked", handleAgentInvoked);

    return () => {
      formElement.removeEventListener("agentInvoked", handleAgentInvoked);
    };
  }, [toolname, onAgentSubmit]);

  return (
    <form
      ref={formRef}
      {...(toolname ? { toolname } : {})}
      {...(tooldescription ? { tooldescription } : {})}
      {...(toolautosubmit ? { toolautosubmit: "true" } : {})}
      data-toolname={toolname}
      data-tooldescription={tooldescription}
      {...props}
    >
      {children}
    </form>
  );
}
