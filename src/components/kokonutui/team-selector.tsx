"use client";

/**
 * @author: @dorianbaffier
 * @description: Team Selector
 * @version: 2.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { AnimatePresence, motion, type Variants } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";

const MAX_TEAM_SIZE = 4;
const AVATAR_OVERLAP = 10;

interface TeamMember {
  id: string;
  avatarUrl: string;
  name: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "member-1",
    avatarUrl:
      "https://bykuknqwpctcjrowysyf.supabase.co/storage/v1/object/public/assets/avatar-01.png",
    name: "Team Member 1",
  },
  {
    id: "member-2",
    avatarUrl:
      "https://bykuknqwpctcjrowysyf.supabase.co/storage/v1/object/public/assets/avatar-02.png",
    name: "Team Member 2",
  },
  {
    id: "member-3",
    avatarUrl:
      "https://bykuknqwpctcjrowysyf.supabase.co/storage/v1/object/public/assets/avatar-03.png",
    name: "Team Member 3",
  },
  {
    id: "member-4",
    avatarUrl:
      "https://bykuknqwpctcjrowysyf.supabase.co/storage/v1/object/public/assets/avatar-04.png",
    name: "Team Member 4",
  },
] as const;

const animations = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  } satisfies Variants,
  avatar: {
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.8,
      },
    },
    hidden: {
      opacity: 0,
      scale: 0.6,
      transition: { duration: 0.22, ease: "easeOut" },
    },
  } satisfies Variants,
  vibration: {
    idle: { x: 0 },
    shake: {
      x: [-4, 4, -4, 4, 0] as const,
      transition: { duration: 0.38, ease: "easeOut" },
    },
  } satisfies Variants,
} as const;

interface TeamSelectorProps {
  defaultValue?: number;
  onChange?: (size: number) => void;
  className?: string;
}

export default function TeamSelector({
  defaultValue = 1,
  onChange,
  className = "",
}: TeamSelectorProps) {
  const [peopleCount, setPeopleCount] = useState(defaultValue);
  const [isVibrating, setIsVibrating] = useState(false);
  const directionRef = useRef<1 | -1>(1);

  const handleIncrement = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (peopleCount < MAX_TEAM_SIZE) {
      directionRef.current = 1;
      const newCount = peopleCount + 1;
      setPeopleCount(newCount);
      onChange?.(newCount);
    } else {
      triggerVibration();
    }
  };

  const handleDecrement = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (peopleCount > 1) {
      directionRef.current = -1;
      const newCount = peopleCount - 1;
      setPeopleCount(newCount);
      onChange?.(newCount);
    } else {
      triggerVibration();
    }
  };

  const triggerVibration = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 380);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    action: "increment" | "decrement"
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action === "increment" ? handleIncrement(e) : handleDecrement(e);
    }
  };

  return (
    <motion.div
      animate="animate"
      className={`flex w-full flex-col items-center justify-center ${className}`}
      exit="exit"
      initial="initial"
      variants={animations.container}
    >
      <div className="w-full max-w-xs rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:border-white/8 dark:bg-zinc-900/60">
        <fieldset>
          <legend className="mb-6 w-full font-medium text-xs text-zinc-400 uppercase tracking-widest dark:text-zinc-500">
            Team Size
          </legend>

          {/* Avatar stack — all 4 always rendered, toggled via variants */}
          <div className="mb-8 flex justify-center">
            <motion.div className="flex items-center" layout>
              {TEAM_MEMBERS.map((member, index) => (
                <motion.div
                  animate={index < peopleCount ? "visible" : "hidden"}
                  className="flex items-center justify-center"
                  initial={index < defaultValue ? "visible" : "hidden"}
                  key={member.id}
                  style={{
                    marginLeft: index === 0 ? 0 : -AVATAR_OVERLAP,
                    zIndex: MAX_TEAM_SIZE - index,
                  }}
                  variants={animations.avatar}
                >
                  <Image
                    alt={member.name}
                    className="size-12 rounded-full border border-white/60 bg-linear-to-b from-white/5 to-white/20 object-cover shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:border-white/10 dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                    height={96}
                    src={member.avatarUrl}
                    width={96}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Controls row */}
          <motion.div
            animate={isVibrating ? "shake" : "idle"}
            className="flex items-center justify-center gap-6"
            initial="idle"
            variants={animations.vibration}
          >
            <button
              aria-label="Decrease team size"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-linear-to-b from-white to-zinc-50 text-zinc-500 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-200 hover:border-zinc-300 hover:text-zinc-900 hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 focus-visible:ring-offset-2 active:from-zinc-50 active:to-zinc-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/8 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-500 dark:focus-visible:ring-zinc-500/40 dark:focus-visible:ring-offset-zinc-900 dark:hover:border-white/16 dark:hover:text-zinc-200"
              disabled={peopleCount <= 1}
              onClick={handleDecrement}
              onKeyDown={(e) => handleKeyDown(e, "decrement")}
              type="button"
            >
              <span className="select-none font-medium leading-none">−</span>
            </button>

            {/* Counter + label */}
            <div className="flex min-w-16 flex-col items-center">
              <div className="relative h-10 overflow-hidden">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.output
                    animate={{ opacity: 1, y: 0 }}
                    aria-label={`Current team size: ${peopleCount}`}
                    className="block select-none bg-linear-to-b from-zinc-800 to-zinc-500 bg-clip-text font-semibold text-3xl text-transparent dark:from-zinc-100 dark:to-zinc-400"
                    exit={{
                      opacity: 0,
                      y: directionRef.current * -16,
                      transition: { duration: 0.16, ease: "easeIn" },
                    }}
                    initial={{
                      opacity: 0,
                      y: directionRef.current * 16,
                    }}
                    key={peopleCount}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    {peopleCount}
                  </motion.output>
                </AnimatePresence>
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {peopleCount === 1 ? "member" : "members"}
              </span>
            </div>

            <button
              aria-label="Increase team size"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-linear-to-b from-white to-zinc-50 text-zinc-500 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-200 hover:border-zinc-300 hover:text-zinc-900 hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 focus-visible:ring-offset-2 active:from-zinc-50 active:to-zinc-100 disabled:cursor-not-allowed disabled:opacity-35 dark:border-white/8 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-500 dark:focus-visible:ring-zinc-500/40 dark:focus-visible:ring-offset-zinc-900 dark:hover:border-white/16 dark:hover:text-zinc-200"
              disabled={peopleCount >= MAX_TEAM_SIZE}
              onClick={handleIncrement}
              onKeyDown={(e) => handleKeyDown(e, "increment")}
              type="button"
            >
              <span className="select-none font-medium leading-none">+</span>
            </button>
          </motion.div>
        </fieldset>
      </div>
    </motion.div>
  );
}
