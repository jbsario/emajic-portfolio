import { motion, type Variant } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface Props {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  scale?: boolean;
  blur?: boolean;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 80 },
  down: { x: 0, y: -80 },
  left: { x: -80, y: 0 },
  right: { x: 80, y: 0 },
  none: { x: 0, y: 0 },
};

const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.9,
  className = "",
  once = true,
  scale = false,
  blur = true,
}: Props) => {
  const offset = offsets[direction];

  const hidden: Variant = {
    opacity: 0,
    x: offset.x,
    y: offset.y,
    ...(scale && { scale: 0.94 }),
    ...(blur && { filter: "blur(12px)" }),
  };

  const visible: Variant = {
    opacity: 1,
    x: 0,
    y: 0,
    ...(scale && { scale: 1 }),
    ...(blur && { filter: "blur(0px)" }),
  };

  return (
    <motion.div
      initial={hidden}
      whileInView={visible}
      viewport={{ once, amount: 0.15 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
