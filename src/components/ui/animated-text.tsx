import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  animationType?: "fade" | "slideUp" | "slideDown";
  // Optional key to control re-animation (e.g. current language)
  dependencyKey?: string | number;
}

const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },
  slideDown: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
};

export const AnimatedText = ({
  children,
  className = "",
  animationType = "fade",
  dependencyKey,
}: AnimatedTextProps) => {
  const shouldReduceMotion = useReducedMotion();
  const variant = animationVariants[animationType];

  // If reduced motion, skip animation
  if (shouldReduceMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={dependencyKey ?? String(children)}
        initial={variant.initial}
        animate={variant.animate}
        exit={variant.exit}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={className}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
};