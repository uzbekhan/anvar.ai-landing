import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import { Cpu, Search, GitBranch, ShoppingCart, Code2, Shield } from "lucide-react";

const features = [
  { icon: Cpu, title: "Agentic Execution Engine", desc: "Automatically executes services through APIs with intelligent routing and failover." },
  { icon: Search, title: "Service Discovery Network", desc: "Agents discover and compare service providers across a global catalog in real time." },
  { icon: GitBranch, title: "API Orchestration Layer", desc: "Coordinates complex workflows across multiple services and providers seamlessly." },
  { icon: ShoppingCart, title: "In-App Transaction Completion", desc: "Services complete directly inside applications — no redirects, no context switching." },
  { icon: Code2, title: "Developer Integration Toolkit", desc: "SDKs and APIs enable easy integration with any software platform." },
  { icon: Shield, title: "Trust & Compliance Layer", desc: "Enterprise-grade security, audit logging, and compliance controls built into every transaction." },
];

const PlatformFeatures = () => {
  return (
    <SectionWrapper id="features">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-[10px] font-mono text-gold/40 uppercase tracking-[0.4em] mb-4">Capabilities</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text-platinum tracking-tight">Platform Features</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card card-hover-premium p-7 group relative overflow-hidden"
          >
            <div className="w-11 h-11 rounded-lg glass-card-luxury flex items-center justify-center mb-5 group-hover:glow-gold transition-all duration-500">
              <f.icon size={18} className="text-champagne/70 group-hover:text-champagne transition-colors duration-500" />
            </div>
            <h3 className="text-base font-semibold mb-2.5 text-foreground tracking-wide">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default PlatformFeatures;