import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";

const VisionSection = () => {
  return (
    <SectionWrapper>
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] font-mono text-gold/40 uppercase tracking-[0.4em] mb-4">Vision</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="gradient-text-platinum">The Future Interface for</span>{" "}
            <span className="gradient-text-shine">Digital Services</span>
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>AI agents will become the primary interface for interacting with digital services.</p>
            <p>Instead of navigating apps and websites, users will simply express their intent.</p>
            <p className="text-foreground/80 font-medium">Anvar AI provides the infrastructure that allows these agents to execute real-world services.</p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default VisionSection;
