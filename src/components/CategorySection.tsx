import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import CodeTypingAnimation from "./CodeTypingAnimation";

const CategorySection = () => {
  return (
    <SectionWrapper id="platform">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono text-gold/40 uppercase tracking-[0.4em] mb-4"
          >
            A New Category
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          >
            <span className="gradient-text-platinum">Introducing Agentic</span>{" "}
            <span className="gradient-text-shine">Service Infrastructure</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4 text-muted-foreground leading-relaxed"
          >
            <p>
              Agentic Service Infrastructure is a new technology layer that enables AI agents to perform real-world services through integrated APIs.
            </p>
            <p>
              Instead of redirecting users across applications and websites, agents can complete services directly inside software platforms.
            </p>
            <p className="text-foreground/80 font-medium">
              Anvar AI provides the infrastructure that makes this possible.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <CodeTypingAnimation />
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default CategorySection;
