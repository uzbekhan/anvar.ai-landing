import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  value: number;
  suffix?: string;
  duration?: number;
}

const PAUSE_DURATION = 4000; // pause at final value before restarting

const AnimatedCounter = ({ value, suffix = "", duration = 2 }: Props) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "0px" });
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;

    setCount(0);
    let start = 0;
    const end = value;
    const step = end / (duration * 60);
    let done = false;

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        if (!done) {
          done = true;
          clearInterval(timer);
          // Restart after pause
          setTimeout(() => setCycle((c) => c + 1), PAUSE_DURATION);
        }
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [inView, value, duration, cycle]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
