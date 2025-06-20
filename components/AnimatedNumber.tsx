import { useEffect, useRef } from "react"
import { motion, useMotionValue, animate } from "framer-motion"

export default function AnimatedNumber({ value, duration = 1 }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      onUpdate: (latest) => {
        if (nodeRef.current) {
          nodeRef.current.textContent = typeof value === "number"
            ? Math.round(latest).toString()
            : latest.toString()
        }
      },
    })
    return controls.stop
  }, [value, duration, motionValue])

  return <motion.span ref={nodeRef} />
}