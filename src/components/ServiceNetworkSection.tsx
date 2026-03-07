import { useEffect, useState, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import SectionWrapper from "./SectionWrapper";
import { useIsMobile } from "@/hooks/use-mobile";

const apis = [
  "Travel APIs",
  "Connectivity APIs",
  "Commerce APIs",
  "Payment Gateways",
  "Crypto & Wallet",
  "Accommodation APIs",
  "Logistics APIs",
  "Information APIs",
  "Operator APIs",
  "Banking APIs",
  "Exchange APIs",
];

interface CodeSnippet {
  label: string;
  providers: string[];
  lines: { text: string; type: "keyword" | "string" | "comment" | "variable" | "method" | "bracket" | "operator" | "property" | "plain" }[][];
}

const codeSnippets: CodeSnippet[] = [
  {
    label: "Travel APIs",
    providers: ["Emirates", "ANA", "Ryanair", "Turkish Airlines", "Singapore Air"],
    lines: [
      [{ text: "// Search & book flights across 50+ airlines", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " flights", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "travel", type: "property" }, { text: ".", type: "plain" }, { text: "search", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  from', type: "property" }, { text: ': ', type: "operator" }, { text: '"London"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  to', type: "property" }, { text: ': ', type: "operator" }, { text: '"Tokyo"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  class', type: "property" }, { text: ': ', type: "operator" }, { text: '"business"', type: "string" }],
      [{ text: "});", type: "bracket" }],
      [],
      [{ text: "const", type: "keyword" }, { text: " booking", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "travel", type: "property" }, { text: ".", type: "plain" }, { text: "book", type: "method" }, { text: "(", type: "bracket" }, { text: "flights", type: "variable" }, { text: "[", type: "bracket" }, { text: "0", type: "variable" }, { text: "]", type: "bracket" }, { text: ");", type: "bracket" }],
      [{ text: '// → { pnr: "AV8X2K", airline: "ANA", seat: "2K" }', type: "comment" }],
    ],
  },
  {
    label: "Connectivity APIs",
    providers: ["TrueMove H", "Claro", "KT Telecom", "SIMALLO", "HalloCall"],
    lines: [
      [{ text: "// Activate eSIM for 190+ countries", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " plan", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "connectivity", type: "property" }, { text: ".", type: "plain" }, { text: "findPlan", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  country', type: "property" }, { text: ': ', type: "operator" }, { text: '"Japan"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  data', type: "property" }, { text: ': ', type: "operator" }, { text: '"10GB"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  duration', type: "property" }, { text: ': ', type: "operator" }, { text: '7', type: "variable" }],
      [{ text: "});", type: "bracket" }],
      [],
      [{ text: "const", type: "keyword" }, { text: " esim", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "connectivity", type: "property" }, { text: ".", type: "plain" }, { text: "activate", type: "method" }, { text: "(", type: "bracket" }, { text: "plan", type: "variable" }, { text: ");", type: "bracket" }],
      [{ text: '// → { qrCode: "data:image/png...", iccid: "893..." }', type: "comment" }],
    ],
  },
  {
    label: "Commerce APIs",
    providers: ["Amazon", "Apple Store", "Best Buy", "eBay", "Alibaba"],
    lines: [
      [{ text: "// Compare prices across 8+ marketplaces", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " results", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "commerce", type: "property" }, { text: ".", type: "plain" }, { text: "search", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  query', type: "property" }, { text: ': ', type: "operator" }, { text: '"Sony WH-1000XM5"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  maxPrice', type: "property" }, { text: ': ', type: "operator" }, { text: '300', type: "variable" }, { text: ",", type: "plain" }],
      [{ text: '  currency', type: "property" }, { text: ': ', type: "operator" }, { text: '"USD"', type: "string" }],
      [{ text: "});", type: "bracket" }],
      [],
      [{ text: "const", type: "keyword" }, { text: " order", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "commerce", type: "property" }, { text: ".", type: "plain" }, { text: "purchase", type: "method" }, { text: "(", type: "bracket" }, { text: "results", type: "variable" }, { text: ".", type: "plain" }, { text: "best", type: "property" }, { text: ");", type: "bracket" }],
      [{ text: '// → { orderId: "SN-82910", delivery: "2-day" }', type: "comment" }],
    ],
  },
  {
    label: "Payment Gateways",
    providers: ["Stripe", "Visa", "Mastercard", "Apple Pay", "PayPal"],
    lines: [
      [{ text: "// Process fiat payments via 10+ gateways", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " payment", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "payments", type: "property" }, { text: ".", type: "plain" }, { text: "charge", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  amount', type: "property" }, { text: ': ', type: "operator" }, { text: '428', type: "variable" }, { text: ",", type: "plain" }],
      [{ text: '  currency', type: "property" }, { text: ': ', type: "operator" }, { text: '"GBP"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  gateway', type: "property" }, { text: ': ', type: "operator" }, { text: '"stripe"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  card', type: "property" }, { text: ': ', type: "operator" }, { text: '"visa_4242"', type: "string" }],
      [{ text: "});", type: "bracket" }],
      [{ text: '// → { id: "pi_3N2x...", status: "succeeded" }', type: "comment" }],
    ],
  },
  {
    label: "Crypto & Wallet",
    providers: ["Uniswap", "MetaMask", "Lido", "Stargate", "Coinbase"],
    lines: [
      [{ text: "// Swap, send, stake across chains", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " swap", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "crypto", type: "property" }, { text: ".", type: "plain" }, { text: "swap", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  from', type: "property" }, { text: ': ', type: "operator" }, { text: '{ token: "ETH", amount: 0.5 }', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  to', type: "property" }, { text: ': ', type: "operator" }, { text: '"USDT"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  dex', type: "property" }, { text: ': ', type: "operator" }, { text: '"uniswap_v3"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  slippage', type: "property" }, { text: ': ', type: "operator" }, { text: '0.5', type: "variable" }],
      [{ text: "});", type: "bracket" }],
      [{ text: '// → { txHash: "0xf4a2...", received: "1710.25 USDT" }', type: "comment" }],
    ],
  },
  {
    label: "Accommodation APIs",
    providers: ["Booking.com", "Four Seasons", "Airbnb", "Hilton", "Expedia"],
    lines: [
      [{ text: "// Search hotels, resorts & rentals globally", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " rooms", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "hotels", type: "property" }, { text: ".", type: "plain" }, { text: "search", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  city', type: "property" }, { text: ': ', type: "operator" }, { text: '"Tokyo"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  area', type: "property" }, { text: ': ', type: "operator" }, { text: '"Shibuya"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  nights', type: "property" }, { text: ': ', type: "operator" }, { text: '3', type: "variable" }, { text: ",", type: "plain" }],
      [{ text: '  rating', type: "property" }, { text: ': ', type: "operator" }, { text: '"4+"', type: "string" }],
      [{ text: "});", type: "bracket" }],
      [{ text: '// → { hotel: "Cerulean Tower", conf: "CT-38291" }', type: "comment" }],
    ],
  },
  {
    label: "Logistics APIs",
    providers: ["DHL", "FedEx", "UPS", "Amazon Logistics", "Royal Mail"],
    lines: [
      [{ text: "// Track & manage shipments end-to-end", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " shipment", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "logistics", type: "property" }, { text: ".", type: "plain" }, { text: "track", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  tracking', type: "property" }, { text: ': ', type: "operator" }, { text: '"SN-82910-EX"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  carrier', type: "property" }, { text: ': ', type: "operator" }, { text: '"auto"', type: "string" }],
      [{ text: "});", type: "bracket" }],
      [],
      [{ text: '// → { status: "In Transit", eta: "Mar 10"', type: "comment" }],
      [{ text: '//    location: "Frankfurt Hub", carrier: "DHL" }', type: "comment" }],
    ],
  },
  {
    label: "Information APIs",
    providers: ["OpenWeather", "Google Maps", "Twilio", "SendGrid", "DeepL"],
    lines: [
      [{ text: "// Real-time data, translation & notifications", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " translated", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "info", type: "property" }, { text: ".", type: "plain" }, { text: "translate", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  text', type: "property" }, { text: ': ', type: "operator" }, { text: '"Book a table for 2"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  from', type: "property" }, { text: ': ', type: "operator" }, { text: '"en"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  to', type: "property" }, { text: ': ', type: "operator" }, { text: '"ja"', type: "string" }],
      [{ text: "});", type: "bracket" }],
      [],
      [{ text: '// → { result: "2名様のご予約をお願いします" }', type: "comment" }],
    ],
  },
  {
    label: "Operator APIs",
    providers: ["HalloCall", "SIMALLO", "eSIMvu", "Vodafone", "T-Mobile"],
    lines: [
      [{ text: "// Manage mobile plans, devices & subscriptions", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " plan", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "operator", type: "property" }, { text: ".", type: "plain" }, { text: "subscribe", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  type', type: "property" }, { text: ': ', type: "operator" }, { text: '"unlimited"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  device', type: "property" }, { text: ': ', type: "operator" }, { text: '"Samsung S25 Ultra"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  lines', type: "property" }, { text: ': ', type: "operator" }, { text: '1', type: "variable" }],
      [{ text: "});", type: "bracket" }],
      [],
      [{ text: '// → { planId: "HC-UNL-001", billing: "$65/mo" }', type: "comment" }],
    ],
  },
  {
    label: "Banking APIs",
    providers: ["Al Rayan", "Wahed", "Amana Bank", "Gatehouse", "UIF"],
    lines: [
      [{ text: "// Halal banking — savings, financing & transfers", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " account", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "banking", type: "property" }, { text: ".", type: "plain" }, { text: "openAccount", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  type', type: "property" }, { text: ': ', type: "operator" }, { text: '"mudarabah"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  sharia', type: "property" }, { text: ': ', type: "operator" }, { text: 'true', type: "variable" }, { text: ",", type: "plain" }],
      [{ text: '  bank', type: "property" }, { text: ': ', type: "operator" }, { text: '"al_rayan"', type: "string" }],
      [{ text: "});", type: "bracket" }],
      [],
      [{ text: '// → { accountId: "AR-MUD-482", profit: "4.8%" }', type: "comment" }],
    ],
  },
  {
    label: "Exchange APIs",
    providers: ["SPUS", "Wahed Invest", "Zoya", "Musaffa", "Islamicly"],
    lines: [
      [{ text: "// Halal stock screening & portfolio management", type: "comment" }],
      [{ text: "const", type: "keyword" }, { text: " portfolio", type: "variable" }, { text: " = ", type: "operator" }, { text: "await", type: "keyword" }, { text: " agent", type: "variable" }, { text: ".", type: "plain" }, { text: "exchange", type: "property" }, { text: ".", type: "plain" }, { text: "invest", type: "method" }, { text: "({", type: "bracket" }],
      [{ text: '  screening', type: "property" }, { text: ': ', type: "operator" }, { text: '"AAOIFI"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  sector', type: "property" }, { text: ': ', type: "operator" }, { text: '"tech"', type: "string" }, { text: ",", type: "plain" }],
      [{ text: '  amount', type: "property" }, { text: ': ', type: "operator" }, { text: '500', type: "variable" }],
      [{ text: "});", type: "bracket" }],
      [],
      [{ text: '// → { stocks: ["AAPL","MSFT","NVDA"], halal: true }', type: "comment" }],
    ],
  },
];

const typeColorMap: Record<string, string> = {
  keyword: "text-[hsl(0_0%_65%)]",
  string: "text-[hsl(0_0%_55%)]",
  comment: "text-[hsl(0_0%_35%)]",
  variable: "text-[hsl(0_0%_82%)]",
  method: "text-[hsl(0_0%_90%)]",
  bracket: "text-[hsl(0_0%_50%)]",
  operator: "text-[hsl(0_0%_50%)]",
  property: "text-[hsl(0_0%_72%)]",
  plain: "text-[hsl(0_0%_58%)]",
};

interface FlatChar {
  char: string;
  type: string;
  isNewline?: boolean;
}

function flattenSnippet(snippet: CodeSnippet): FlatChar[] {
  const chars: FlatChar[] = [];
  snippet.lines.forEach((tokens, lineIdx) => {
    if (lineIdx > 0) chars.push({ char: "\n", type: "plain", isNewline: true });
    tokens.forEach((token) => {
      for (const ch of token.text) {
        chars.push({ char: ch, type: token.type });
      }
    });
  });
  return chars;
}

const ServiceNetworkSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "0px" });
  const [activeSnippet, setActiveSnippet] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  const currentChars = flattenSnippet(codeSnippets[activeSnippet]);

  // Typing effect
  useEffect(() => {
    if (!inView) return;
    setCharIndex(0);
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const typeNext = () => {
      if (cancelled) return;
      if (i >= currentChars.length) {
        timeout = setTimeout(() => {
          if (!cancelled) {
            setActiveSnippet((prev) => (prev + 1) % codeSnippets.length);
            setCycle((c) => c + 1);
          }
        }, 2500);
        return;
      }

      const current = currentChars[i];
      i++;
      setCharIndex(i);

      let delay: number;
      if (current.isNewline) {
        delay = 80 + Math.random() * 100;
      } else if (current.char === " ") {
        delay = 20 + Math.random() * 10;
      } else {
        delay = 18 + Math.random() * 22;
      }

      timeout = setTimeout(typeNext, delay);
    };

    timeout = setTimeout(typeNext, 400);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [inView, cycle, activeSnippet]);

  // Build rendered lines
  const typedChars = currentChars.slice(0, charIndex);
  const lines: FlatChar[][] = [[]];
  typedChars.forEach((ch) => {
    if (ch.isNewline) lines.push([]);
    else lines[lines.length - 1].push(ch);
  });

  const isComplete = charIndex >= currentChars.length;
  const cursorLineIdx = lines.length - 1;
  const activeProviders = codeSnippets[activeSnippet].providers;

  return (
    <SectionWrapper id="network">
      <div className="grid lg:grid-cols-2 gap-16 items-center" ref={ref}>
        {/* Network Visualization - Desktop: orbit, Mobile: grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-full flex justify-center lg:block"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
           {/* Mobile: circular orbit layout */}
           <div className="block lg:hidden relative w-full aspect-square max-w-[360px] mx-auto">
             {/* Orbit circle */}
             <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 360 360">
               <circle cx="180" cy="180" r="140" fill="none" stroke="rgba(200,200,200,0.08)" strokeWidth="1" strokeDasharray="4 4" />
             </svg>

             {/* Center node */}
             <div className="absolute z-10 w-20 h-20 rounded-full glass-card-strong flex items-center justify-center glow-silver"
               style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
               <span className="text-[9px] font-mono text-platinum text-center leading-tight">Anvar AI<br/>Engine</span>
             </div>

             {/* API labels */}
             {apis.map((api, i) => {
               const angle = (i / apis.length) * Math.PI * 2 - Math.PI / 2;
               const x = 50 + Math.cos(angle) * 40;
               const y = 50 + Math.sin(angle) * 40;
               const isActive = codeSnippets[activeSnippet].label === api;
               return (
                 <motion.div
                   key={api}
                   initial={{ opacity: 0, scale: 0.8 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.15 + i * 0.06 }}
                   className="absolute z-20 cursor-pointer"
                   style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                   onClick={() => { setActiveSnippet(i); setCycle((c) => c + 1); }}
                 >
                   <div className={`px-2 py-1.5 rounded-lg text-[8px] font-mono whitespace-nowrap transition-all duration-300 ${
                     isActive
                       ? "glass-card-strong text-platinum border border-platinum/20 glow-soft"
                       : "glass-card text-silver/60"
                   }`}>
                     {api}
                   </div>
                 </motion.div>
               );
             })}
           </div>

          {/* Desktop: circular orbit layout */}
          <div className="hidden lg:block relative" style={{ paddingBottom: "100%" }}>
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full glass-card-strong flex items-center justify-center z-10 glow-silver">
                <span className="text-xs font-mono text-platinum text-center leading-tight">Anvar AI<br/>Engine</span>
              </div>

              {/* Orbit ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/20" style={{ width: "88%", height: "88%" }} />

              {apis.map((api, i) => {
                const angle = (i / apis.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 44;
                const x = 50 + Math.cos(angle) * radius;
                const y = 50 + Math.sin(angle) * radius;
                const isActive = codeSnippets[activeSnippet].label === api;
                return (
                  <motion.div
                    key={api}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="absolute cursor-pointer z-20"
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                    onClick={() => { setActiveSnippet(i); setCycle((c) => c + 1); }}
                  >
                    <div className={`relative px-2.5 py-1.5 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "glass-card-strong text-platinum border border-platinum/20 glow-soft"
                        : "glass-card text-silver/70 node-pulse"
                    }`}>
                      {api}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Text + Code */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] font-mono text-gold/40 uppercase tracking-[0.4em] mb-4">Ecosystem</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="gradient-text-platinum">The Anvar AI</span>{" "}
              <span className="gradient-text-shine">Service Network</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
              <p>Service providers publish APIs that intelligent agents can execute.</p>
              <p>Applications integrating Anvar AI automatically gain access to a growing ecosystem of services.</p>
            </div>
          </motion.div>

          {/* Providers Strip */}
          <motion.div
            key={activeSnippet}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {activeProviders.map((provider) => (
              <span
                key={provider}
                className="text-[10px] font-mono text-muted-foreground/50 px-2 py-1 rounded-md border border-border/30 bg-foreground/[0.02]"
              >
                {provider}
              </span>
            ))}
          </motion.div>

          {/* Code Block */}
          <div className="glass-card-strong rounded-xl overflow-hidden glow-soft">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-foreground/10" />
                <div className="w-2 h-2 rounded-full bg-foreground/10" />
                <div className="w-2 h-2 rounded-full bg-foreground/10" />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono ml-2">integration.ts</span>
              <div className="ml-auto">
                <span className="text-[9px] text-platinum/50 font-mono px-2 py-0.5 rounded bg-platinum/5">
                  {codeSnippets[activeSnippet].label}
                </span>
              </div>
            </div>

            <div className="p-4 font-mono text-[12px] leading-5 min-h-[220px] relative">
              {lines.map((lineChars, lineNum) => (
                <div key={lineNum} className="flex">
                  <span className="w-6 text-right text-muted-foreground/15 mr-3 select-none text-[10px] shrink-0">
                    {lineNum + 1}
                  </span>
                  <span className="flex-1">
                    {lineChars.map((ch, ci) => (
                      <span key={ci} className={typeColorMap[ch.type] || "text-[hsl(0_0%_58%)]"}>
                        {ch.char}
                      </span>
                    ))}
                    {lineNum === cursorLineIdx && !isComplete && (
                      <motion.span
                        className="inline-block w-[2px] h-[13px] bg-platinum/80 ml-[1px] align-middle"
                        animate={{ opacity: [1, 1, 0, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ServiceNetworkSection;
