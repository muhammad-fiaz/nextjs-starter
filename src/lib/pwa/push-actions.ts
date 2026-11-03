"use server";

import webpush from "web-push";

import { env } from "@/env";
import { siteConfig } from "@/site.config";

// Demo-only in-memory subscription store.
// Serverless instances do not share module state, so replace this with a
// database or KV store keyed by the push endpoint before production use.
let activeSubscription: webpush.PushSubscription | null = null;

function ensureVapidConfigured(): boolean {
  const publicKey = env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = env.VAPID_PRIVATE_KEY;
  const email = siteConfig.organization?.email;

  if (publicKey && privateKey && email) {
    try {
      const contactSubject = email.startsWith("mailto:") ? email : `mailto:${email}`;
      webpush.setVapidDetails(contactSubject, publicKey, privateKey);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function subscribeUser(sub: webpush.PushSubscription): Promise<{
  readonly success: boolean;
  readonly error?: string;
}> {
  activeSubscription = sub;
  return { success: true };
}

export async function unsubscribeUser(): Promise<{ readonly success: boolean }> {
  activeSubscription = null;
  return { success: true };
}

export async function sendNotification(message: string): Promise<{
  readonly success: boolean;
  readonly error?: string;
}> {
  if (!activeSubscription) {
    return { success: false, error: "No active push subscription available." };
  }

  const isConfigured = ensureVapidConfigured();
  if (!isConfigured) {
    return {
      success: false,
      error:
        "VAPID keys (NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY) not configured in environment.",
    };
  }

  try {
    await webpush.sendNotification(
      activeSubscription,
      JSON.stringify({
        title: siteConfig.name || "Notification",
        body: message,
        icon: "/icon-192x192.png",
      }),
    );
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send notification",
    };
  }
}
