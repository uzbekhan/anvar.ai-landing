import { motion } from "framer-motion";
import GlobalNetworkViz from "./GlobalNetworkViz";
import AnimatedCounter from "./AnimatedCounter";

const metrics = [
  { value: 50, suffix: "+", label: "Service Categories" },
  { value: 200, suffix: "+", label: "API Integrations Planned" },
  { value: 70, suffix: "+", label: "Countries Targeted" },
  { value: 99.9, suffix: "%", label: "Uptime Target" },
];

const HeroSection = () => {
  return (
    <section className="relative flex flex-col justify-center overflow-hidden pt-24 pb-8">
      <GlobalNetworkViz />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-card-luxury mb-10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-luxury-pulse" />
          <span className="text-[11px] font-medium text-champagne tracking-[0.2em] uppercase">Introducing Agentic Service Infrastructure</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.02] tracking-[-0.02em] mb-8 max-w-5xl mx-auto"
        >
          <span className="gradient-text-platinum">The Operating System for</span>
          <br />
          <span className="gradient-text-shine">Agentic Services</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed tracking-wide"
        >
          The first Agentic Service Infrastructure platform enabling AI agents to discover, orchestrate, and execute real-world services through APIs — directly inside applications.
        </motion.p>

        {/* Flow diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex items-center justify-center gap-2 md:gap-4 text-xs text-muted-foreground font-mono flex-wrap mb-16"
        >
          {["Conversation", "Intent", "Agent", "Execution", "Fulfillment"].map((step, i) => (
            <motion.span
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              className="flex items-center gap-2 md:gap-4"
            >
              <span className="px-4 py-2 rounded-lg glass-card text-silver/80 tracking-wider">{step}</span>
              {i < 4 && <span className="text-gold/40 text-lg">→</span>}
            </motion.span>
          ))}
        </motion.div>

        {/* Luxury divider */}
        <div className="luxury-divider max-w-md mx-auto mb-12" />

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold font-display gradient-text-gold tracking-tight">
                <AnimatedCounter value={m.value} suffix={m.suffix} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-2 tracking-widest uppercase">{m.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-[10px] text-muted-foreground/30 mt-6 uppercase tracking-[0.4em] font-mono"
        >
          Designed Platform Capacity
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;