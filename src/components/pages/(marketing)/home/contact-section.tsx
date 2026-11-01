"use client";

import { useForm } from "@tanstack/react-form";
import { CheckCircle2, Send, Sparkles } from "lucide-react";
import { type ReactNode, useState } from "react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WebMCPForm } from "@/components/webmcp/webmcp-form";
import type { DictionaryHome } from "@/types/i18n";

interface ContactSectionProps {
  readonly contactI18n?: DictionaryHome["contact"];
}

const contactFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactSection({ contactI18n }: ContactSectionProps): ReactNode {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    validators: {
      onChange: contactFormSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSubmitted(true);
      return { success: true, data: value };
    },
  });

  const handleAgentSubmit = async (values: Record<string, unknown>) => {
    const validated = contactFormSchema.safeParse(values);
    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      };
    }

    form.setFieldValue("name", String(values.name || ""));
    form.setFieldValue("email", String(values.email || ""));
    form.setFieldValue("message", String(values.message || ""));

    setSubmitted(true);
    return {
      success: true,
      message: "Contact message submitted via WebMCP agent interaction.",
      received: validated.data,
    };
  };

  return (
    <section id="contact" className="border-border/40 border-t py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium">
            <Sparkles className="text-primary h-3.5 w-3.5" />
            {contactI18n?.badge || "WebMCP + TanStack Form"}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {contactI18n?.heading || "Contact & Agentic Demo"}
          </h2>
          <p className="text-muted-foreground text-base">
            {contactI18n?.subheading ||
              "Send us a message or test autonomous AI agent WebMCP form interactions."}
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <Card className="border-border/60 shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg">{contactI18n?.heading || "Contact Form"}</CardTitle>
              <CardDescription>
                Powered by TanStack Form with first-class type safety and WebMCP agent annotations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="border-primary/20 bg-primary/5 space-y-3 rounded-xl border p-6 text-center">
                  <CheckCircle2 className="text-primary mx-auto h-8 w-8" />
                  <h3 className="text-foreground font-semibold">
                    {contactI18n?.successTitle || "Message sent successfully!"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {contactI18n?.successDescription ||
                      "Thank you for getting in touch. We will reply to your inquiry shortly."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.reset();
                      setSubmitted(false);
                    }}
                    className="mt-2 text-xs"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <WebMCPForm
                  toolname="submit_contact_message"
                  tooldescription="Submit user inquiry, contact message, or feedback to Next.js Starter team"
                  toolautosubmit={false}
                  onAgentSubmit={handleAgentSubmit}
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-5"
                >
                  {}
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? contactI18n?.errorNameRequired || "Name is required" : undefined,
                    }}
                  >
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          {contactI18n?.nameLabel || "Full Name"}
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={contactI18n?.namePlaceholder || "Ada Lovelace"}
                          aria-invalid={!field.state.meta.isValid}
                        />
                        {field.state.meta.isTouched && !field.state.meta.isValid && (
                          <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                        )}
                      </Field>
                    )}
                  </form.Field>

                  {}
                  <form.Field
                    name="email"
                    validators={{
                      onChange: ({ value }) => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!value || !emailRegex.test(value)) {
                          return (
                            contactI18n?.errorEmailInvalid || "Please enter a valid email address"
                          );
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          {contactI18n?.emailLabel || "Email Address"}
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={contactI18n?.emailPlaceholder || "ada@example.com"}
                          aria-invalid={!field.state.meta.isValid}
                        />
                        {field.state.meta.isTouched && !field.state.meta.isValid && (
                          <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                        )}
                      </Field>
                    )}
                  </form.Field>

                  {}
                  <form.Field
                    name="message"
                    validators={{
                      onChange: ({ value }) =>
                        !value || value.length < 10
                          ? contactI18n?.errorMessageRequired ||
                            "Message must be at least 10 characters"
                          : undefined,
                    }}
                  >
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>
                          {contactI18n?.messageLabel || "Message"}
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          rows={4}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={
                            contactI18n?.messagePlaceholder ||
                            "Tell us about your project or question..."
                          }
                          aria-invalid={!field.state.meta.isValid}
                        />
                        {field.state.meta.isTouched && !field.state.meta.isValid && (
                          <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                        )}
                      </Field>
                    )}
                  </form.Field>

                  {}
                  <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                      <div className="flex items-center justify-between pt-2">
                        <Button
                          type="submit"
                          disabled={!canSubmit || Boolean(isSubmitting)}
                          className="gap-2"
                        >
                          <Send className="h-4 w-4" />
                          {isSubmitting
                            ? contactI18n?.submittingButton || "Sending..."
                            : contactI18n?.submitButton || "Send Message"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => form.reset()}
                          className="text-muted-foreground text-xs"
                        >
                          Reset
                        </Button>
                      </div>
                    )}
                  </form.Subscribe>
                </WebMCPForm>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
