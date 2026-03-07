import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Search, Zap, Globe, ShoppingCart, Wifi } from "lucide-react";

const steps = [
  { icon: Zap, text: "Intent detected: mobile connectivity request", color: "text-primary" },
  { icon: Search, text: "Searching service network...", color: "text-secondary" },
  { icon: Globe, text: "3 providers discovered in Japan", color: "text-secondary" },
  { icon: ShoppingCart, text: "Comparing plans — best option selected", color: "text-primary" },
  { icon: Wifi, text: "Executing transaction...", color: "text-accent" },
  { icon: Check, text: "Service activated successfully ✓", color: "text-emerald-400" },
];

const AgentConsoleDemo = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= steps.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div ref={ref} className="surface-elevated rounded-xl overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-xs text-muted-foreground font-mono ml-2">anvar-agent-console</span>
      </div>

      <div className="p-5 space-y-4">
        {/* User request */}
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">U</div>
          <div className="surface-card px-4 py-2.5 text-sm">
            "I need mobile internet in Japan for 7 days"
          </div>
        </div>

        {/* Agent steps */}
        <div className="space-y-2 pl-9">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={i < visibleSteps ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2.5 console-text"
            >
              <step.icon size={14} className={step.color} />
              <span className={i < visibleSteps ? "text-foreground/80" : "text-transparent"}>
                {step.text}
              </span>
            </motion.div>
          ))}
        </div>

        {visibleSteps >= steps.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="ml-9 mt-3 px-3 py-2 rounded border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 font-mono"
          >
            → Service delivered inside application
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AgentConsoleDemo;
