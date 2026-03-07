import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Token {
  text: string;
  type: "keyword" | "string" | "comment" | "variable" | "method" | "bracket" | "operator" | "property" | "plain";
}

const codeLine: Token[][] = [
  [
    { text: "import", type: "keyword" },
    { text: " { ", type: "bracket" },
    { text: "AnvarAgent", type: "variable" },
    { text: " } ", type: "bracket" },
    { text: "from", type: "keyword" },
    { text: ' "@anvar/sdk"', type: "string" },
    { text: ";", type: "plain" },
  ],
  [],
  [
    { text: "const", type: "keyword" },
    { text: " agent", type: "variable" },
    { text: " = ", type: "operator" },
    { text: "new", type: "keyword" },
    { text: " AnvarAgent", type: "method" },
    { text: "({", type: "bracket" },
  ],
  [
    { text: "  apiKey", type: "property" },
    { text: ": ", type: "operator" },
    { text: "process", type: "variable" },
    { text: ".", type: "plain" },
    { text: "env", type: "property" },
    { text: ".", type: "plain" },
    { text: "ANVAR_API_KEY", type: "variable" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "  network", type: "property" },
    { text: ": ", type: "operator" },
    { text: '"global"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "  execution", type: "property" },
    { text: ": ", type: "operator" },
    { text: '"auto"', type: "string" },
  ],
  [
    { text: "});", type: "bracket" },
  ],
  [],
  [
    { text: "const", type: "keyword" },
    { text: " result", type: "variable" },
    { text: " = ", type: "operator" },
    { text: "await", type: "keyword" },
    { text: " agent", type: "variable" },
    { text: ".", type: "plain" },
    { text: "execute", type: "method" },
    { text: "({", type: "bracket" },
  ],
  [
    { text: "  intent", type: "property" },
    { text: ": ", type: "operator" },
    { text: '"mobile internet in Japan, 7 days"', type: "string" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "  discover", type: "property" },
    { text: ": ", type: "operator" },
    { text: "true", type: "keyword" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "  compare", type: "property" },
    { text: ": ", type: "operator" },
    { text: "true", type: "keyword" },
    { text: ",", type: "plain" },
  ],
  [
    { text: "  autoComplete", type: "property" },
    { text: ": ", type: "operator" },
    { text: "true", type: "keyword" },
  ],
  [
    { text: "});", type: "bracket" },
  ],
  [],
  [
    { text: "// → Service activated successfully", type: "comment" },
  ],
  [
    { text: "console", type: "variable" },
    { text: ".", type: "plain" },
    { text: "log", type: "method" },
    { text: "(", type: "bracket" },
    { text: "result", type: "variable" },
    { text: ".", type: "plain" },
    { text: "status", type: "property" },
    { text: ");", type: "bracket" },
  ],
  [
    { text: '// "fulfilled"', type: "comment" },
  ],
];

// Flatten all characters with their styling
interface FlatChar {
  char: string;
  type: Token["type"];
  lineIdx: number;
  isNewline?: boolean;
}

function flattenCode(): FlatChar[] {
  const chars: FlatChar[] = [];
  codeLine.forEach((tokens, lineIdx) => {
    if (lineIdx > 0) {
      chars.push({ char: "\n", type: "plain", lineIdx, isNewline: true });
    }
    tokens.forEach((token) => {
      for (const ch of token.text) {
        chars.push({ char: ch, type: token.type, lineIdx });
      }
    });
  });
  return chars;
}

const allChars = flattenCode();

const typeColorMap: Record<Token["type"], string> = {
  keyword: "text-[hsl(0_0%_65%)]",       // muted silver
  string: "text-[hsl(0_0%_55%)]",        // darker silver
  comment: "text-[hsl(0_0%_35%)]",       // dim
  variable: "text-[hsl(0_0%_82%)]",      // bright platinum
  method: "text-[hsl(0_0%_90%)]",        // near white
  bracket: "text-[hsl(0_0%_50%)]",       // mid gray
  operator: "text-[hsl(0_0%_50%)]",      // mid gray
  property: "text-[hsl(0_0%_72%)]",      // silver
  plain: "text-[hsl(0_0%_58%)]",         // default
};

const RESTART_DELAY = 3000; // pause before restarting

const CodeTypingAnimation = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "0px" });
  const [charIndex, setCharIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Reset for new cycle
    setCharIndex(0);
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const typeNext = () => {
      if (cancelled) return;
      if (i >= allChars.length) {
        // Wait then restart
        timeout = setTimeout(() => {
          if (!cancelled) setCycle((c) => c + 1);
        }, RESTART_DELAY);
        return;
      }

      const current = allChars[i];
      i++;
      setCharIndex(i);

      let delay: number;
      if (current.isNewline) {
        const nextLine = allChars[i];
        if (nextLine?.isNewline) {
          delay = 200;
        } else {
          delay = 100 + Math.random() * 150;
        }
      } else if (current.char === " ") {
        delay = 25 + Math.random() * 15;
      } else if (current.char === "." || current.char === "(" || current.char === "{") {
        delay = 50 + Math.random() * 30;
      } else {
        delay = 20 + Math.random() * 25;
      }

      if (Math.random() < 0.02 && !current.isNewline) {
        delay += 150 + Math.random() * 200;
      }

      timeout = setTimeout(typeNext, delay);
    };

    // Small initial delay
    timeout = setTimeout(typeNext, 300);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [inView, cycle]);

  const typedChars = allChars.slice(0, charIndex);
  const lines: FlatChar[][] = [[]];
  typedChars.forEach((ch) => {
    if (ch.isNewline) {
      lines.push([]);
    } else {
      lines[lines.length - 1].push(ch);
    }
  });

  const cursorLineIdx = lines.length - 1;
  const isComplete = charIndex >= allChars.length;

  return (
    <div ref={ref} className="glass-card-strong rounded-xl overflow-hidden glow-soft">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
        </div>
        <span className="text-[10px] text-muted-foreground font-mono ml-2">agent.ts</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/40 font-mono">TypeScript</span>
        </div>
      </div>

      <div className="p-5 font-mono text-[13px] leading-6 min-h-[380px] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-8 bg-gradient-to-b from-transparent via-foreground/[0.015] to-transparent animate-scanline" />
        </div>

        {lines.map((lineChars, lineNum) => (
          <div key={lineNum} className="flex">
            <span className="w-8 text-right text-muted-foreground/15 mr-4 select-none text-xs shrink-0">
              {lineNum + 1}
            </span>
            <span className="flex-1">
              {lineNum === cursorLineIdx && !isComplete && (
                <motion.span
                  className="absolute left-0 right-0 h-6 bg-foreground/[0.03] -ml-1 rounded-sm pointer-events-none"
                  style={{ marginTop: "-2px" }}
                />
              )}
              {lineChars.map((ch, ci) => (
                <span key={ci} className={typeColorMap[ch.type]}>
                  {ch.char}
                </span>
              ))}
              {lineNum === cursorLineIdx && !isComplete && (
                <motion.span
                  className="inline-block w-[2px] h-[15px] bg-platinum/80 ml-[1px] align-middle"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </span>
          </div>
        ))}

        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center gap-2 pl-12"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-platinum/40" />
            <span className="text-[10px] text-muted-foreground/30 font-mono">Ready to execute</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CodeTypingAnimation;
