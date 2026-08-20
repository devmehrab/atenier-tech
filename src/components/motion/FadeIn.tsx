"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  once = true,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
