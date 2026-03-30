"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  BookOpen,
  Layers,
  ShieldCheck,
  Milestone,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface CodeTab {
  id: string;
  label: string;
  language: string;
  code: string;
}

const CODE_TABS: CodeTab[] = [
  {
    id: "server",
    label: "server.ts",
    language: "typescript",
    code: `import { OfferHub } from "@offerhub/sdk";

const oh = new OfferHub({ apiKey: process.env.OFFERHUB_API_KEY! });

// Create a milestone-based service contract
const contract = await oh.contracts.create({
  client: "GCLIENT_WALLET_ADDRESS",
  provider: "GPROVIDER_WALLET_ADDRESS",
  amount: 8000,
  asset: "USDC",
  currency: "USD",
  milestones: [
    { title: "UX Research & Wireframes", percentage: 30 },
    { title: "Design & Prototyping",     percentage: 40 },
    { title: "Final Delivery & QA",      percentage: 30 },
  ],
});

// Client funds the full contract up-front
const escrow = await oh.escrows.fund(contract.id, {
  walletId: "GCLIENT_WALLET_ADDRESS",
});

console.log("Contract funded:", escrow.status);
// Output: Contract funded: ACTIVE`,
  },
  {
    id: "client",
    label: "client.js",
    language: "javascript",
    code: `import { OfferHub } from "@offerhub/sdk";

const oh = new OfferHub({ apiKey: process.env.OFFERHUB_API_KEY });

// Provider completes milestone 1 — client approves
const approval = await oh.milestones.approve(
  contract.id,
  "milestone_01_id"
);

// Funds for that milestone are released immediately on Stellar
console.log("Milestone released:", approval.released);
// Output: Milestone released: 2400.00 USDC`,
  },
];

interface SDKMethod {
  method: string;
  description: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

const SDK_METHODS: SDKMethod[] = [
  {
    method: "oh.contracts.create()",
    description:
      "Initialize a milestone-based service contract with SOW terms.",
    icon: Layers,
  },
  {
    method: "oh.escrows.fund()",
    description: "Lock the full project budget on-chain before work begins.",
    icon: ShieldCheck,
  },
  {
    method: "oh.milestones.approve()",
    description:
      "Approve a milestone and instantly release the corresponding payment.",
    icon: Milestone,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-content-muted hover:text-content-primary transition-colors shadow-neu-raised-sm bg-bg-elevated"
    >
      {copied ? (
        <Check size={12} className="text-theme-success" />
      ) : (
        <Copy size={12} />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

let highlightCache: Map<string, string> | null = null;

function CodePanel({ tab, isActive }: { tab: CodeTab; isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string | null>(null);

  const highlight = useCallback(async () => {
    if (html) return;
    if (!highlightCache) highlightCache = new Map();
    if (highlightCache.has(tab.id)) {
      setHtml(highlightCache.get(tab.id)!);
      return;
    }
    const shiki = await import("shiki");
    const highlighter = await shiki.createHighlighter({
      themes: ["github-dark"],
      langs: [tab.language as "typescript" | "javascript"],
    });
    const result = highlighter.codeToHtml(tab.code, {
      lang: tab.language,
      theme: "github-dark",
    });
    highlightCache.set(tab.id, result);
    setHtml(result);
  }, [html, tab]);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          highlight();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [highlight]);

  useEffect(() => {
    if (isActive) highlight();
  }, [isActive, highlight]);

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0", isActive ? "block" : "hidden")}
    >
      {html ? (
        <div
          className="sdk-shiki h-full overflow-auto rounded-2xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="h-full overflow-auto p-5 text-xs font-mono text-content-secondary leading-relaxed whitespace-pre-wrap">
          {tab.code}
        </pre>
      )}
    </div>
  );
}

export default function CodeIntegrationShowcase() {
  const [activeTab, setActiveTab] = useState(CODE_TABS[0].id);
  const activeTabData = CODE_TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="rounded-[2rem] shadow-neu-raised bg-bg-elevated overflow-hidden flex flex-col">
        {/* Tab bar */}
        <div className="flex items-center justify-between gap-2 px-4 md:px-6 pt-4 pb-3 border-b border-content-muted/10">
          <div className="flex items-center gap-1">
            {CODE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative rounded-xl px-3 py-1.5 text-xs font-medium transition-colors duration-200",
                  activeTab === tab.id
                    ? "text-content-primary"
                    : "text-content-muted hover:text-content-secondary",
                )}
              >
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="service-platforms-tab-pill"
                    className="absolute inset-0 rounded-xl shadow-neu-raised-sm bg-bg-base"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </div>

          <CopyButton text={activeTabData.code} />
        </div>

        {/* Code area */}
        <div className="relative h-72 md:h-96">
          {CODE_TABS.map((tab) => (
            <CodePanel key={tab.id} tab={tab} isActive={activeTab === tab.id} />
          ))}
        </div>
      </div>

      {/* SDK method cards */}
      <div className="flex flex-col md:flex-row gap-4">
        {SDK_METHODS.map((method, i) => {
          const Icon = method.icon;
          return (
            <div
              key={method.method}
              className="flex-1 flex items-start gap-3 p-4 md:p-5 rounded-2xl shadow-neu-raised bg-bg-elevated animate-fadeInUp"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-8 h-8 rounded-lg shadow-neu-sunken-subtle bg-bg-base flex items-center justify-center text-theme-primary flex-shrink-0">
                <Icon size={15} />
              </div>
              <div>
                <code className="text-xs font-semibold text-theme-primary block mb-1">
                  {method.method}
                </code>
                <p className="text-[11px] text-content-muted leading-relaxed">
                  {method.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-content-muted flex items-center justify-center gap-1.5">
        <BookOpen size={12} />
        Full SDK reference and examples in the{" "}
        <a
          href="/docs"
          className="text-theme-primary hover:underline underline-offset-2"
        >
          documentation
        </a>
      </p>

      <style jsx global>{`
        .sdk-shiki pre {
          background: transparent !important;
          padding: 1.25rem;
          font-size: 0.75rem;
          line-height: 1.6;
          height: 100%;
          overflow: auto;
        }
      `}</style>
    </div>
  );
}
