import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import { Shield, Building2, MonitorSmartphone, Network, TrendingUp } from "lucide-react";

const reasons = [
  { icon: Shield, text: "Built for real service execution, not just AI conversation" },
  { icon: Building2, text: "Infrastructure designed for SaaS platforms" },
  { icon: MonitorSmartphone, text: "In-app transaction completion" },
  { icon: Network, text: "Service network creates powerful network effects" },
  { icon: TrendingUp, text: "Agentic workflows convert user intent into revenue-generating services" },
];

const ReasonsTobelieve = () => {
  return (
    <SectionWrapper>
      <div className="luxury-divider max-w-xs mx-auto mb-14" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Why Platforms Choose <span className="gradient-text-shine">Anvar AI</span>
        </h2>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-3">
        {reasons.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 glass-card card-hover-premium p-5"
          >
            <r.icon size={18} className="text-champagne/50 shrink-0" />
            <span className="text-sm md:text-base text-foreground/80 tracking-wide">{r.text}</span>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default ReasonsTobelieve;