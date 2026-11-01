"use client";

import { Check } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { sendNotification, subscribeUser, unsubscribeUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/env";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager(): ReactNode {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register(
        new URL("../../lib/service-worker.js", import.meta.url),
        {
          scope: "/",
          updateViaCache: "none",
        },
      );
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch {}
  }

  async function subscribeToPush() {
    try {
      const vapidKey = env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        setStatus("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured in .env");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const convertedKey = urlBase64ToUint8Array(vapidKey);
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey as unknown as BufferSource,
      });
      setSubscription(sub);
      const serializedSub = JSON.parse(JSON.stringify(sub));
      await subscribeUser(serializedSub);
      setStatus("Subscribed successfully!");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to subscribe");
    }
  }

  async function unsubscribeFromPush() {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
      await unsubscribeUser();
      setStatus("Unsubscribed successfully.");
    }
  }

  async function sendTestNotification() {
    if (subscription && message.trim()) {
      const res = await sendNotification(message);
      if (res.success) {
        setStatus("Notification sent!");
        setMessage("");
      } else {
        setStatus(res.error || "Failed to send");
      }
    }
  }

  if (!isSupported) {
    return (
      <p className="text-muted-foreground text-xs">
        Push notifications are not supported in this browser environment.
      </p>
    );
  }

  return (
    <div className="border-border bg-card text-card-foreground space-y-4 rounded-xl border p-5">
      <div>
        <h3 className="text-foreground text-sm font-semibold">Web Push Notifications</h3>
        <p className="text-muted-foreground text-xs">
          Native Web Push API integration powered by modern Next.js App Router and Server Actions.
        </p>
      </div>

      {status ? (
        <div className="border-border bg-muted/40 rounded-md border px-3 py-2 text-xs">
          {status}
        </div>
      ) : null}

      {subscription ? (
        <div className="space-y-3">
          <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            <span>Active push subscription verified.</span>
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="text"
              placeholder="Enter test notification message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="text-xs"
            />
            <Button size="sm" onClick={sendTestNotification} disabled={!message.trim()}>
              Send Test
            </Button>
            <Button variant="outline" size="sm" onClick={unsubscribeFromPush}>
              Unsubscribe
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={subscribeToPush}>
            Enable Push Notifications
          </Button>
        </div>
      )}
    </div>
  );
}

export function InstallPrompt(): ReactNode {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as unknown as { MSStream?: unknown }).MSStream,
    );
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null;
  }

  return (
    <div className="border-border bg-card text-card-foreground space-y-2 rounded-xl border p-4">
      <h3 className="text-foreground text-sm font-semibold">Install Application</h3>
      {isIOS ? (
        <p className="text-muted-foreground text-xs leading-relaxed">
          To install this PWA on your iOS device, tap the share button{" "}
          <span role="img" aria-label="share icon">
            ⎋
          </span>{" "}
          in Safari and select <strong>&quot;Add to Home Screen&quot;</strong>{" "}
          <span role="img" aria-label="plus icon">
            ➕
          </span>
          .
        </p>
      ) : (
        <p className="text-muted-foreground text-xs leading-relaxed">
          This application meets PWA standards and can be added directly to your device home screen
          or desktop.
        </p>
      )}
    </div>
  );
}
