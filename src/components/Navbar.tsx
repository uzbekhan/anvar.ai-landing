import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import anvarLogo from "@/assets/anvar-logo.webp";
import anvarIcon from "@/assets/anvar-icon.webp";

const navLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#features", label: "Features" },
  { href: "#network", label: "Network" },
  { href: "#use-cases", label: "Use Cases" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl"
        style={{
          background: "linear-gradient(180deg, hsl(0 0% 3% / 0.85), hsl(0 0% 3% / 0.7))",
          borderBottom: "1px solid hsl(40 20% 50% / 0.08)",
        }}
      >
        <div className="container mx-auto flex items-center justify-between h-20 px-6">
          <div className="flex items-center gap-3">
            <img src={anvarLogo} alt="Anvar AI" className="h-[52px]" />
            <span className="hidden sm:inline-block text-[10px] text-muted-foreground/40 font-mono tracking-[0.15em] uppercase border-l border-border/50 pl-3 ml-1">From Intent to Execution</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm text-muted-foreground tracking-wide">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-champagne transition-colors duration-500">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-5">
            <span className="text-xs text-muted-foreground/50 font-mono tracking-[0.3em] uppercase">Coming Soon</span>
            <a href="mailto:partnership@swiftreload.com" className="glass-card-luxury px-6 py-2.5 text-sm font-medium text-champagne hover:text-foreground transition-all duration-500 tracking-wider uppercase">
              Investors
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-lg glass-card flex items-center justify-center text-champagne"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-20 z-40 backdrop-blur-2xl border-b"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 3% / 0.95), hsl(0 0% 3% / 0.9))",
              borderColor: "hsl(40 20% 50% / 0.08)",
            }}
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 text-base text-muted-foreground hover:text-champagne transition-colors duration-300 tracking-wide rounded-lg hover:bg-foreground/[0.03]"
                >
                  {link.label}
                </motion.a>
              ))}

              <div className="luxury-divider my-4" />

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-muted-foreground/50 font-mono tracking-[0.2em] uppercase">Coming Soon</span>
                <a
                  href="mailto:partnership@swiftreload.com"
                  onClick={() => setMobileOpen(false)}
                  className="glass-card-luxury px-5 py-2 text-sm font-medium text-champagne tracking-wider uppercase"
                >
                  Investors
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;