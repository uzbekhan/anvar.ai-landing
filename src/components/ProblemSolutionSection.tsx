import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import { ArrowRight } from "lucide-react";
import APIFlowVisualization from "./APIFlowVisualization";

const ProblemSolutionSection = () => {
  return (
    <>
      {/* Problem */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] font-mono text-gold/40 uppercase tracking-[0.4em] mb-6">The Problem</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="gradient-text-platinum">AI Can Answer Questions</span><br />
              <span className="text-muted-foreground">But It Cannot Execute Services</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>Most AI assistants today can search, summarize, and recommend. However they cannot perform real services such as bookings, purchases, or activations.</p>
              <p>Users still need to navigate multiple apps and websites. This limits the real commercial potential of AI.</p>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Solution */}
      <SectionWrapper>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[10px] font-mono text-gold/40 uppercase tracking-[0.4em] mb-4">The Solution</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                From AI Answers to{" "}
                <span className="gradient-text-shine">AI Execution</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Anvar AI provides the infrastructure layer that enables AI agents to discover services, orchestrate APIs, execute transactions, and deliver completed services inside applications.
              </p>

              {/* Workflow */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: "Intent", cls: "text-silver" },
                  { label: "Agent", cls: "text-platinum" },
                  { label: "Execution Engine", cls: "text-foreground" },
                  { label: "Service APIs", cls: "text-silver" },
                  { label: "Result", cls: "text-platinum" },
                ].map((step, i) => (
                  <span key={step.label} className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-lg glass-card text-xs font-mono ${step.cls}`}>
                      {step.label}
                    </span>
                    {i < 4 && <ArrowRight size={12} className="text-muted-foreground/30" />}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <APIFlowVisualization />
          </motion.div>
        </div>
      </SectionWrapper>
    </>
  );
};

export default ProblemSolutionSection;
