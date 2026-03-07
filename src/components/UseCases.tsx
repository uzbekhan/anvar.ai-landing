import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import AnvarChatDemo from "./AnvarChatDemo";

const UseCases = () => {
  return (
    <SectionWrapper id="use-cases">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-[10px] font-mono text-gold/40 uppercase tracking-[0.4em] mb-4">Use Cases</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text-platinum tracking-tight">See It In Action</h2>
        <p className="text-muted-foreground mt-4">
          Switch between industries to see how Anvar AI agents execute real services inside applications.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto"
      >
        <AnvarChatDemo />
      </motion.div>
    </SectionWrapper>
  );
};

export default UseCases;
