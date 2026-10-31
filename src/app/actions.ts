"use server";

import webpush from "web-push";

import { env } from "@/env";
import { siteConfig } from "@/site.config";

// In-memory subscription store for server actions in starter template
// In production, persist subscriptions to your database
let globalSubscription: webpush.PushSubscription | null = null;

function ensureVapidConfigured(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = siteConfig.organization?.email || "mailto:contact@example.com";
  const contactSubject = email.startsWith("mailto:") ? email : `mailto:${email}`;

  if (publicKey && privateKey) {
    try {
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
  globalSubscription = sub;
  return { success: true };
}

export async function unsubscribeUser(): Promise<{ readonly success: boolean }> {
  globalSubscription = null;
  return { success: true };
}

export async function sendNotification(message: string): Promise<{
  readonly success: boolean;
  readonly error?: string;
}> {
  if (!globalSubscription) {
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
      globalSubscription,
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
