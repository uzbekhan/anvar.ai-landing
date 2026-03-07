import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface Scenario {
  message: string;
  steps: string[];
  result: string;
}

const scenarios: Scenario[] = [
  {
    message: '"I need internet in Italy for one week."',
    steps: ["5 plans discovered", "Best option selected", "Purchase completed", "eSIM activated"],
    result: "Service fulfilled — eSIM delivered inside the app.",
  },
  {
    message: '"Book a flight from London to Dubai, March 14."',
    steps: ["12 airlines scanned", "Best fare selected", "Payment processed", "Boarding pass issued"],
    result: "Flight booked — Emirates EK-002, Seat 24A.",
  },
  {
    message: '"Find a boutique hotel in Paris, March 20–22."',
    steps: ["312 properties searched", "Top match found", "Reservation secured", "Confirmation sent"],
    result: "Hotel booked — Hôtel du Petit Moulin, 2 nights.",
  },
  {
    message: '"Buy Sony WH-1000XM5 headphones under $300."',
    steps: ["6 marketplaces scanned", "Best price found", "Order placed", "Tracking generated"],
    result: "Order confirmed — arriving March 10, express.",
  },
  {
    message: '"Swap 0.5 ETH to USDT on the best DEX."',
    steps: ["3 DEX rates compared", "Best route selected", "Transaction signed", "Swap confirmed"],
    result: "Swap complete — 1,710.25 USDT received.",
  },
  {
    message: '"Get me an unlimited data plan with a new device."',
    steps: ["8 operators compared", "Best bundle found", "Device + plan selected", "Subscription activated"],
    result: "Activated — HalloCall Unlimited + Samsung S25, monthly billing.",
  },
  {
    message: '"Open a Sharia-compliant savings account with profit sharing."',
    steps: ["4 halal banks checked", "Best profit rate found", "KYC verified", "Account opened"],
    result: "Account active — Mudarabah savings, 4.8% expected profit.",
  },
  {
    message: '"Invest $500 in halal-certified tech stocks."',
    steps: ["Sharia screening applied", "3 compliant stocks found", "Portfolio allocated", "Order executed"],
    result: "Invested — $500 across AAPL, MSFT, NVDA (halal certified).",
  },
];

const RESTART_DELAY = 3000;

const ExampleInteraction = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "0px" });
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [cycle, setCycle] = useState(0);

  const current = scenarios[scenarioIdx];
  const userMessage = current.message;
  const steps = current.steps;

  // Reset on cycle change or when coming into view
  useEffect(() => {
    if (!inView) return;
    setTypedChars(0);
    setTypingDone(false);
    setActiveStep(-1);
  }, [inView, cycle]);

  // Phase 1: Type user message char by char
  useEffect(() => {
    if (!inView) return;
    if (typingDone) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= userMessage.length) {
        setTypedChars(userMessage.length);
        clearInterval(interval);
        setTimeout(() => setTypingDone(true), 500);
        return;
      }
      setTypedChars(i);
    }, 45);
    return () => clearInterval(interval);
  }, [inView, cycle, userMessage]);

  // Phase 2: Execute steps sequentially
  useEffect(() => {
    if (!typingDone) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const durations = [1500, 1300, 1200, 1000];
    let cumulative = 600;

    timers.push(setTimeout(() => setActiveStep(0), 600));
    durations.forEach((dur, i) => {
      cumulative += dur;
      timers.push(setTimeout(() => setActiveStep(i + 1), cumulative));
    });

    // Advance to next scenario and restart
    timers.push(setTimeout(() => {
      setScenarioIdx((prev) => (prev + 1) % scenarios.length);
      setCycle((c) => c + 1);
    }, cumulative + RESTART_DELAY));

    return () => timers.forEach(clearTimeout);
  }, [typingDone]);

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">
              <span className="gradient-text-platinum">One Conversation.</span><br />
              <span className="gradient-text-shine">Real Services Executed.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card-strong rounded-xl p-6 mt-10 text-left glow-soft"
          >
            {/* User message typing */}
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full glass-card flex items-center justify-center text-xs text-silver shrink-0 mt-0.5">U</div>
              <div className="text-sm text-foreground min-h-[24px] font-mono">
                <span>{userMessage.slice(0, typedChars)}</span>
                {typedChars < userMessage.length && (
                  <span className="inline-block w-[2px] h-4 bg-platinum ml-0.5 animate-blink align-middle" />
                )}
              </div>
            </div>

            {/* Agent execution */}
            {typingDone && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="pl-9 mt-5 space-y-0"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded glass-card flex items-center justify-center">
                    <span className="text-[9px] font-bold text-platinum">A</span>
                  </div>
                  <TypingText key={`exec-${cycle}`} text="anvar-agent executing..." className="text-[11px] text-muted-foreground font-mono" speed={35} />
                </div>

                {steps.map((step, i) => {
                  const isComplete = activeStep > i;
                  const isProcessing = activeStep === i;
                  const isWaiting = activeStep < i;

                  if (isWaiting) return <div key={i} />;

                  return (
                    <motion.div
                      key={`${cycle}-${i}`}
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 py-2.5 border-b border-border/20 last:border-0"
                    >
                      {isComplete && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                          <Check size={14} className="text-platinum/70" />
                        </motion.div>
                      )}
                      {isProcessing && (
                        <Loader2 size={14} className="text-silver/40 animate-spin" />
                      )}

                      <span className="font-mono text-sm flex-1">
                        {isProcessing ? (
                          <TypingText
                            key={`step-${cycle}-${i}`}
                            text={step}
                            className="text-foreground/80"
                            speed={40}
                          />
                        ) : (
                          <span className="text-silver/50">{step}</span>
                        )}
                      </span>

                      {isProcessing && (
                        <motion.span
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className="text-[10px] text-muted-foreground/30 font-mono"
                        >
                          processing
                        </motion.span>
                      )}
                      {isComplete && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] text-muted-foreground/25 font-mono"
                        >
                          done
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}

                {activeStep >= steps.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-4 px-4 py-3 rounded-lg glass-card text-xs font-mono flex items-center gap-2"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
                      className="w-5 h-5 rounded-full glass-card-strong flex items-center justify-center"
                    >
                      <Check size={10} className="text-platinum" />
                    </motion.div>
                    <TypingText
                      key={`fulfilled-${cycle}`}
                      text={current.result}
                      className="text-platinum/80"
                      speed={20}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TypingText = ({ text, className, speed = 40 }: { text: string; className?: string; speed?: number }) => {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    setChars(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= text.length) {
        setChars(text.length);
        clearInterval(interval);
        return;
      }
      setChars(i);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {text.slice(0, chars)}
      {chars < text.length && (
        <span className="inline-block w-[2px] h-3.5 bg-platinum/60 ml-[1px] animate-blink align-middle" />
      )}
    </span>
  );
};

export default ExampleInteraction;
