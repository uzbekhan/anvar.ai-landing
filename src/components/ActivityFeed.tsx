import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, Globe, Loader2 } from "lucide-react";

const entries = [
  { text: "Agent executed eSIM activation", location: "Italy", flag: "🇮🇹", service: "Connectivity" },
  { text: "Agent completed flight booking", location: "Dubai", flag: "🇦🇪", service: "Travel" },
  { text: "Agent processed digital goods purchase", location: "Brazil", flag: "🇧🇷", service: "Commerce" },
  { text: "Agent activated telecom service", location: "Germany", flag: "🇩🇪", service: "Connectivity" },
  { text: "Agent executed API workflow", location: "Singapore", flag: "🇸🇬", service: "Platform" },
  { text: "Agent completed hotel reservation", location: "Tokyo", flag: "🇯🇵", service: "Travel" },
  { text: "Agent processed payment", location: "United Kingdom", flag: "🇬🇧", service: "Finance" },
  { text: "Agent activated connectivity service", location: "France", flag: "🇫🇷", service: "Connectivity" },
  { text: "Agent completed marketplace order", location: "United States", flag: "🇺🇸", service: "Commerce" },
  { text: "Agent executed insurance activation", location: "Australia", flag: "🇦🇺", service: "Finance" },
  { text: "Agent processed subscription renewal", location: "South Korea", flag: "🇰🇷", service: "Platform" },
  { text: "Agent completed car rental booking", location: "Spain", flag: "🇪🇸", service: "Travel" },
];

interface FeedEntry {
  id: number;
  text: string;
  location: string;
  flag: string;
  service: string;
  time: string;
  status: "typing" | "processing" | "done";
  typedChars: number;
}

const SectionWrapper = ({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) => (
  <section id={id} className={`py-10 md:py-14 ${className}`}>
    <div className="container mx-auto px-6">{children}</div>
  </section>
);

const ActivityFeed = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const idxRef = useRef(0);
  const counterRef = useRef(0);

  useEffect(() => {
    if (!inView) return;

    const addEntry = () => {
      const entry = entries[idxRef.current % entries.length];
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const id = counterRef.current++;
      idxRef.current++;

      // Add as "typing"
      setFeed((prev) => [
        { ...entry, id, time, status: "typing", typedChars: 0 },
        ...prev.slice(0, 6),
      ]);

      // Type out the text
      const fullText = `${entry.text} — ${entry.location}`;
      let charIdx = 0;
      const typeInterval = setInterval(() => {
        charIdx++;
        if (charIdx >= fullText.length) {
          clearInterval(typeInterval);
          // Move to processing
          setFeed((prev) =>
            prev.map((e) => (e.id === id ? { ...e, status: "processing", typedChars: fullText.length } : e))
          );
          // Then done after a short delay
          setTimeout(() => {
            setFeed((prev) =>
              prev.map((e) => (e.id === id ? { ...e, status: "done" } : e))
            );
          }, 800);
        } else {
          setFeed((prev) =>
            prev.map((e) => (e.id === id ? { ...e, typedChars: charIdx } : e))
          );
        }
      }, 30);
    };

    // First entry quickly
    const startTimer = setTimeout(addEntry, 300);
    // Then every 3.5s
    const interval = setInterval(addEntry, 3500);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
    };
  }, [inView]);

  return (
    <SectionWrapper>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <p className="text-[10px] font-mono text-gold/40 uppercase tracking-[0.4em] mb-4">Infrastructure</p>
        <h2 className="text-2xl md:text-3xl font-bold gradient-text-platinum tracking-tight">Agent Activity Feed</h2>
      </motion.div>

      <div className="max-w-4xl mx-auto glass-card-strong rounded-xl overflow-hidden glow-soft">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-platinum/60 animate-pulse" />
            <span className="text-[10px] text-muted-foreground font-mono">live-agent-monitor</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Globe size={10} className="text-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/30 font-mono">Global Network</span>
            </div>
            <div className="flex items-center gap-1">
              <motion.div
                className="w-1 h-3 rounded-full bg-platinum/20"
                animate={{ height: [12, 6, 14, 8, 12] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="w-1 h-3 rounded-full bg-platinum/20"
                animate={{ height: [8, 14, 6, 12, 8] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-1 h-3 rounded-full bg-platinum/20"
                animate={{ height: [14, 8, 12, 6, 14] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="p-3 space-y-0 min-h-[280px]">
          <AnimatePresence initial={false}>
            {feed.map((entry) => {
              const fullText = `${entry.text} — ${entry.location}`;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-border/15 last:border-0"
                >
                  <div className="flex items-center gap-3 py-2.5 px-2">
                    {/* Status icon */}
                    <div className="w-5 flex items-center justify-center shrink-0">
                      {entry.status === "typing" && (
                        <span className="inline-block w-[2px] h-3.5 bg-platinum/60 animate-blink" />
                      )}
                      {entry.status === "processing" && (
                        <Loader2 size={12} className="text-silver/40 animate-spin" />
                      )}
                      {entry.status === "done" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                          <Check size={12} className="text-platinum/50" />
                        </motion.div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[10px] text-muted-foreground/25 font-mono shrink-0 w-16">
                      {entry.time}
                    </span>

                    {/* Flag */}
                    <span className="text-xs shrink-0">{entry.flag}</span>

                    {/* Text - typed out */}
                    <span className="text-xs text-silver/60 font-mono flex-1 truncate">
                      {entry.status === "typing" ? (
                        <>
                          {fullText.slice(0, entry.typedChars)}
                          <span className="inline-block w-[2px] h-3 bg-platinum/50 ml-[1px] animate-blink align-middle" />
                        </>
                      ) : (
                        fullText
                      )}
                    </span>

                    {/* Service tag */}
                    {entry.status === "done" && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[9px] px-1.5 py-0.5 rounded glass-card text-muted-foreground/40 font-mono shrink-0"
                      >
                        {entry.service}
                      </motion.span>
                    )}
                    {entry.status === "processing" && (
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-[9px] text-muted-foreground/25 font-mono shrink-0"
                      >
                        executing
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {feed.length === 0 && inView && (
            <div className="flex items-center justify-center h-[200px]">
              <div className="flex items-center gap-2 text-muted-foreground/20 text-xs font-mono">
                <Loader2 size={12} className="animate-spin" />
                Connecting to agent network...
              </div>
            </div>
          )}
        </div>

        {/* Footer stats */}
        <div className="px-4 py-2.5 border-t border-border/30 flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground/20 font-mono">
            {feed.filter((e) => e.status === "done").length} completed
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[9px] text-muted-foreground/20 font-mono">avg 34ms</span>
            <span className="text-[9px] text-muted-foreground/20 font-mono">99.9% uptime</span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ActivityFeed;
