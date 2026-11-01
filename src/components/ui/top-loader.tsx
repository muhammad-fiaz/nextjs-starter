"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface TopLoaderContextType {
  start: () => void;
  done: () => void;
  setProgress: (value: number) => void;
  isLoading: boolean;
  progress: number;
}

const TopLoaderContext = createContext<TopLoaderContextType | null>(null);

export function useTopLoader(): TopLoaderContextType {
  const context = useContext(TopLoaderContext);
  if (!context) {
    return {
      start: () => {},
      done: () => {},
      setProgress: () => {},
      isLoading: false,
      progress: 0,
    };
  }
  return context;
}

export interface TopLoaderProps {
  /** Height of the loader bar in pixels (default: 3) */
  readonly height?: number;
  /** Custom color classes (default uses Tailwind bg-primary) */
  readonly className?: string;
  /** Show shadow/glow effect under the bar (default: true) */
  readonly showGlow?: boolean;
}

export function TopLoader({
  height = 3,
  className = "bg-primary",
  showGlow = true,
}: TopLoaderProps): ReactNode {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setIsLoading(true);
    setIsVisible(true);
    setProgressState(15);

    // Increment gradually up to 90%
    timerRef.current = setInterval(() => {
      setProgressState((prev) => {
        if (prev >= 90) return prev;
        const diff = (90 - prev) * 0.1;
        return Math.min(90, prev + Math.max(diff, 1));
      });
    }, 200);
  }, [clearTimers]);

  const done = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setProgressState(100);
    setIsLoading(false);

    // Keep at 100% briefly, then fade out
    resetTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      resetTimerRef.current = setTimeout(() => {
        setProgressState(0);
      }, 300);
    }, 200);
  }, []);

  const setProgress = useCallback((val: number) => {
    setProgressState(Math.min(100, Math.max(0, val)));
  }, []);

  // Automatically finish loading when pathname or searchParams change
  useEffect(() => {
    done();
  }, [pathname, searchParams, done]);

  // Global click listener for internal navigation links
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return; // Only primary clicks
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; // Modified clicks

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore hash links, javascript, mailto, tel
      if (
        href.startsWith("#") ||
        href.startsWith("javascript:") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      // Ignore explicit target blank or external rel
      if (anchor.target === "_blank" || anchor.getAttribute("download") !== null) {
        return;
      }

      // Check if target is internal URL
      try {
        const url = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (url.origin !== currentUrl.origin) return; // External link

        // If navigating to the exact same full URL (path, query, and hash), ignore
        if (
          url.pathname === currentUrl.pathname &&
          url.search === currentUrl.search &&
          url.hash !== ""
        ) {
          return;
        }

        // Start top loader on internal route change
        start();
      } catch {
        // Ignore unparseable URLs
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      clearTimers();
    };
  }, [start, clearTimers]);

  return (
    <TopLoaderContext.Provider value={{ start, done, setProgress, isLoading, progress }}>
      <div
        role="progressbar"
        aria-label="Navigation progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-hidden={!isVisible}
        style={{
          height: `${height}px`,
          opacity: isVisible ? 1 : 0,
        }}
        className="pointer-events-none fixed top-0 right-0 left-0 z-9999 transition-opacity duration-300"
      >
        <div
          className={`h-full w-full origin-left transition-transform duration-300 ease-out motion-reduce:transition-none ${className}`}
          style={{
            transform: `scaleX(${progress / 100})`,
          }}
        />
        {showGlow && isVisible && progress > 0 && progress < 100 && (
          <div
            className={`absolute top-0 right-0 h-full w-24 -translate-y-1/2 rounded-full blur-xs transition-opacity duration-300 ${className} opacity-50`}
            style={{
              right: `${100 - progress}%`,
            }}
          />
        )}
      </div>
    </TopLoaderContext.Provider>
  );
}
