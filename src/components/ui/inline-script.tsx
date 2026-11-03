"use client";

/**
 * Renders an inline script that runs during HTML parsing on the server and is
 * inert on the client.
 *
 * React warns when a component renders an executable `<script>` on the client.
 * Switching the type to `text/plain` there keeps the node inert, while
 * `suppressHydrationWarning` lets the server-rendered `text/javascript` node
 * stay in the DOM and execute before hydration.
 *
 * @see https://nextjs.org/docs/app/guides/preventing-flash-before-hydration
 */
export function InlineScript({ html }: { readonly html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
