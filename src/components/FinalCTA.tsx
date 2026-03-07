import { motion } from "framer-motion";

const FinalCTA = () => {
  return (
    <section className="py-20 md:py-28 relative">
      {/* Luxury ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, hsl(40 30% 70%), transparent 70%)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Luxury divider */}
          <div className="luxury-divider max-w-xs mx-auto mb-14" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight tracking-tight gradient-text-platinum">
              The Future of Agentic Applications
            </h2>
            <p className="text-muted-foreground text-lg mb-10 tracking-wide">
              Anvar AI transforms user intent into completed services.
            </p>
            <div className="glass-card-luxury px-8 py-4 inline-flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-gold/60 animate-luxury-pulse" />
              <span className="text-sm text-champagne font-mono tracking-[0.2em] uppercase">Coming Soon</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;