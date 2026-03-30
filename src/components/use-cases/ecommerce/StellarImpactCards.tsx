"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Zap,
  BarChart3,
  PackageCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface MetricCard {
  id: string;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
  offerHub: { value: string; unit: string; sublabel: string };
  traditional: { value: string; unit: string; sublabel: string };
  savingsLabel: string;
  savingsValue: string;
  isGrowth: boolean;
  description: string;
}

const METRICS: MetricCard[] = [
  {
    id: "chargeback",
    label: "Chargeback Risk",
    icon: ShieldCheck,
    offerHub: {
      value: "0",
      unit: "%",
      sublabel: "No chargebacks ever",
    },
    traditional: {
      value: "1.5",
      unit: "%",
      sublabel: "Average e-commerce rate",
    },
    savingsLabel: "Risk eliminated",
    savingsValue: "100%",
    isGrowth: true,
    description:
      "Escrow-based payments eliminate chargebacks entirely. Funds are locked before the transaction begins, making post-purchase fraud claims irrelevant.",
  },
  {
    id: "settlement",
    label: "Seller Settlement",
    icon: Zap,
    offerHub: {
      value: "3.2",
      unit: "sec",
      sublabel: "Stellar average finality",
    },
    traditional: {
      value: "1–3",
      unit: "days",
      sublabel: "Standard payment rails",
    },
    savingsLabel: "Speed increase",
    savingsValue: "50,000×",
    isGrowth: true,
    description:
      "Seller funds are released and settled in under 5 seconds via Stellar. No payout batches, no waiting on payment processors to remit.",
  },
  {
    id: "buyer-protection",
    label: "Buyer Protection",
    icon: PackageCheck,
    offerHub: {
      value: "100",
      unit: "%",
      sublabel: "Escrow-backed guarantee",
    },
    traditional: {
      value: "0",
      unit: "%",
      sublabel: "Merchant-dependent only",
    },
    savingsLabel: "Protection level",
    savingsValue: "Full",
    isGrowth: false,
    description:
      "Every transaction is backed by non-custodial escrow. Buyers are guaranteed a refund path for non-delivery or disputes; sellers are guaranteed payment on confirmed delivery.",
  },
];

type Mode = "offerhub" | "traditional";

function AnimatedNumber({ value, suffix }: { value: string; suffix: string }) {
  const [displayed, setDisplayed] = useState("0");

  useEffect(() => {
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) {
      setDisplayed(value);
      return;
    }

    const duration = 1200;
    const steps = 40;
    const stepMs = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = numeric * eased;

      if (value.includes(".")) {
        const decimals = value.split(".")[1]?.length ?? 1;
        setDisplayed(val.toFixed(decimals));
      } else if (value.includes("–")) {
        setDisplayed(value);
      } else {
        setDisplayed(Math.round(val).toString());
      }

      if (current >= steps) {
        setDisplayed(value);
        clearInterval(timer);
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {displayed}
      <span className="ml-1">{suffix}</span>
    </span>
  );
}

function GrowthBadge({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="flex items-center gap-1.5 bg-theme-success/10 rounded-full px-3 py-1 w-fit"
    >
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <TrendingUp size={12} className="text-theme-success" />
      </motion.div>
      <span className="text-[10px] font-bold text-theme-success uppercase tracking-wider">
        {label}:
      </span>
      <span className="text-[10px] font-black text-theme-success">{value}</span>
    </motion.div>
  );
}

function MetricCardComponent({
  metric,
  mode,
  index,
}: {
  metric: MetricCard;
  mode: Mode;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = metric.icon;
  const active = mode === "offerhub" ? metric.offerHub : metric.traditional;
  const isOfferHub = mode === "offerhub";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.12,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => setExpanded((p) => !p)}
      className={cn(
        "relative rounded-[1.75rem] bg-bg-elevated cursor-pointer select-none",
        "p-6 md:p-7 transition-all duration-300",
        "shadow-neu-raised hover:shadow-neu-raised-hover",
        "overflow-hidden",
      )}
    >
      {isOfferHub && (
        <div
          className="absolute inset-0 rounded-[1.75rem] pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,154,155,0.04) 0%, transparent 60%)",
          }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bg-base shadow-neu-sunken-subtle flex items-center justify-center text-theme-primary flex-shrink-0">
              <Icon size={18} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-content-muted">
              {metric.label}
            </span>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="w-6 h-6 rounded-full bg-bg-base shadow-neu-sunken-subtle flex items-center justify-center"
          >
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 1l4 4 4-4"
                stroke="var(--color-content-muted, #9ca3af)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p
              className={cn(
                "text-4xl md:text-5xl font-black leading-none tracking-tight",
                isOfferHub ? "text-theme-primary" : "text-content-secondary",
              )}
            >
              <AnimatedNumber value={active.value} suffix={active.unit} />
            </p>
            <p className="text-xs text-content-muted mt-1.5 font-medium">
              {active.sublabel}
            </p>
          </motion.div>
        </AnimatePresence>

        {isOfferHub && (
          <GrowthBadge
            label={metric.savingsLabel}
            value={metric.savingsValue}
          />
        )}

        {isOfferHub && (
          <div className="flex items-center gap-2 bg-bg-sunken shadow-neu-sunken-subtle rounded-xl px-3 py-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-content-muted">
              vs
            </span>
            <span className="text-xs font-black text-theme-warning">
              {metric.traditional.value}
              <span className="ml-0.5 font-bold">
                {metric.traditional.unit}
              </span>
            </span>
            <span className="text-[10px] text-content-muted truncate">
              {metric.traditional.sublabel}
            </span>
          </div>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="text-xs leading-relaxed text-content-secondary overflow-hidden"
            >
              {metric.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="inline-flex items-center bg-bg-sunken shadow-neu-sunken rounded-2xl p-1 gap-1">
      {(
        [
          { key: "offerhub", label: "OFFER-HUB Engine", icon: Zap },
          { key: "traditional", label: "Standard Platform", icon: BarChart3 },
        ] as const
      ).map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300",
            mode === key
              ? "text-theme-primary shadow-neu-raised"
              : "text-content-muted hover:text-content-secondary",
          )}
        >
          {mode === key && (
            <motion.div
              layoutId="ecommerce-toggle-bg"
              className="absolute inset-0 rounded-xl bg-bg-elevated shadow-neu-raised"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Icon size={13} />
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

function SummaryBar({ mode }: { mode: Mode }) {
  if (mode !== "offerhub") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-bg-elevated shadow-neu-raised rounded-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-theme-success/10 flex items-center justify-center">
          <ShieldCheck size={16} className="text-theme-success" />
        </div>
        <p className="text-sm font-bold text-content-primary">
          OFFER-HUB eliminates chargebacks,{" "}
          <span className="text-theme-primary">100% buyer protection</span>, and
          settles sellers{" "}
          <span className="text-theme-primary">50,000× faster</span> than
          standard payment rails.
        </p>
      </div>
      <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-content-muted bg-bg-base shadow-neu-sunken-subtle rounded-full px-3 py-1">
        Stellar Network · Current averages
      </span>
    </motion.div>
  );
}

export default function StellarImpactCards() {
  const [mode, setMode] = useState<Mode>("offerhub");

  return (
    <div className="relative w-full max-w-5xl mx-auto space-y-6 animate-fadeInScale">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-content-muted mb-1">
            Economic Proof
          </p>
          <h3 className="text-2xl md:text-3xl font-black text-content-primary leading-tight">
            The Stellar Advantage
          </h3>
          <p className="text-sm text-content-secondary mt-1 max-w-md">
            Hard data that answers{" "}
            <em className="not-italic font-semibold text-content-primary">
              &ldquo;Why switch to OFFER-HUB?&rdquo;
            </em>
          </p>
        </div>

        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {METRICS.map((metric, i) => (
          <MetricCardComponent
            key={metric.id}
            metric={metric}
            mode={mode}
            index={i}
          />
        ))}
      </div>

      <AnimatePresence>
        {mode === "offerhub" && <SummaryBar mode={mode} />}
      </AnimatePresence>
    </div>
  );
}
