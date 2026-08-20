"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface SlideUpProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function SlideUp({
  children,
  className,
  delay = 0,
  duration = 0.5,
  distance = 24,
  once = true,
  ...props
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
