"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  once?: boolean;
}

const defaultContainerVariants = (
  staggerDelay: number,
  delayChildren: number
): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: delayChildren,
    },
  },
});

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  delayChildren = 0,
  once = true,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={defaultContainerVariants(staggerDelay, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-50px" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
