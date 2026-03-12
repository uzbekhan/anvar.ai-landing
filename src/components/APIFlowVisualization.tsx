import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";

const apiSteps = [
  { method: "POST", path: "/v1/agent/init", status: 200, time: "12ms" },
  { method: "POST", path: "/v1/intent/parse", status: 200, time: "45ms" },
  { method: "GET", path: "/v1/services/discover", status: 200, time: "89ms" },
  { method: "POST", path: "/v1/orchestrate/compare", status: 200, time: "34ms" },
  { method: "POST", path: "/v1/execute/transaction", status: 201, time: "156ms" },
  { method: "GET", path: "/v1/fulfillment/status", status: 200, time: "8ms" },
];

const RESTART_DELAY = 3000;

const APIFlowVisualization = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "0px" });
  const [activeStep, setActiveStep] = useState(-1);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;

    setActiveStep(-1);
    const timers: ReturnType<typeof setTimeout>[] = [];

    const durations = [800, 900, 1200, 700, 1400, 500];
    let cumulative = 400;

    timers.push(setTimeout(() => setActiveStep(0), 400));

    durations.forEach((dur, i) => {
      cumulative += dur;
      timers.push(setTimeout(() => setActiveStep(i + 1), cumulative));
    });

    // Restart after completion
    timers.push(setTimeout(() => setCycle((c) => c + 1), cumulative + RESTART_DELAY));

    return () => timers.forEach(clearTimeout);
  }, [inView, cycle]);

  return (
    <div ref={ref} className="glass-card-strong rounded-xl overflow-hidden glow-soft">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono ml-2">API Request Log</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-platinum/60 animate-pulse" />
          <span className="text-[10px] text-muted-foreground/40 font-mono">Live</span>
        </div>
      </div>

      <div className="p-4 space-y-0 font-mono text-[12px] min-h-[310px]">
        <AnimatePresence mode="sync">
          {apiSteps.map((step, i) => {
            const isComplete = activeStep > i;
            const isProcessing = activeStep === i;
            const isWaiting = activeStep < i;

            if (isWaiting) return null;

            return (
              <motion.div
                key={`${cycle}-${i}`}
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                transition={{ duration: 0.25 }}
                className="border-b border-border/20 last:border-0"
              >
                <div className="flex items-center gap-3 py-3 relative">
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${
                    step.method === "GET"
                      ? "text-silver bg-silver/10"
                      : "text-platinum bg-platinum/10"
                  }`}>
                    {step.method}
                  </span>

                  <span className="text-foreground/70 shrink-0 flex items-center">
                    {isProcessing ? (
                      <TypingPath key={`${cycle}-path-${i}`} path={step.path} />
                    ) : (
                      step.path
                    )}
                  </span>

                  <div className="ml-auto flex items-center gap-3 shrink-0">
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 size={12} className="animate-spin text-silver/40" />
                        <span className="text-muted-foreground/30 text-[10px]">executing...</span>
                      </motion.div>
                    )}
                    {isComplete && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="flex items-center gap-3"
                      >
                        <span className="text-muted-foreground/40">{step.time}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          step.status === 201
                            ? "text-platinum bg-platinum/10"
                            : "text-silver bg-silver/5"
                        }`}>
                          {step.status}
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[1px] -mt-1 mb-1 mx-1 overflow-hidden rounded-full bg-border/20"
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-silver/20 via-platinum/40 to-silver/20"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activeStep >= apiSteps.length && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 pt-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.4 }}
              >
                <Check size={14} className="text-platinum/60" />
              </motion.div>
              <span className="text-[11px] text-platinum/60">All requests completed</span>
            </div>
            <span className="text-[10px] text-muted-foreground/30">6/6 · 344ms total</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const TypingPath = ({ path }: { path: string }) => {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    setChars(0);
    const interval = setInterval(() => {
      setChars((p) => {
        if (p >= path.length) {
          clearInterval(interval);
          return p;
        }
        return p + 1;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [path]);

  return (
    <>
      {path.slice(0, chars)}
      {chars < path.length && (
        <span className="inline-block w-[2px] h-3.5 bg-platinum/60 ml-[1px] animate-blink align-middle" />
      )}
    </>
  );
};

export default APIFlowVisualization;
