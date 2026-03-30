"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Eye } from "lucide-react";
import { cn } from "@/lib/cn";

type Mode = "offerhub" | "traditional";

interface MetricCard {
  label: string;
  offerhub: string;
  traditional: string;
  icon: React.FC<{ size?: number; className?: string }>;
  savingsLabel: string;
  savingsValue: string;
  description: string;
  higherIsBetter: boolean;
}

const METRICS: MetricCard[] = [
  {
    label: "Invoice Settlement",
    offerhub: "3.2s",
    traditional: "30–45 days",
    icon: Zap,
    savingsLabel: "Faster",
    savingsValue: "1,000,000×",
    description:
      "Funds released on Stellar the moment a milestone is approved.",
    higherIsBetter: false,
  },
  {
    label: "Provider Risk",
    offerhub: "0%",
    traditional: "23%",
    icon: ShieldCheck,
    savingsLabel: "Risk eliminated",
    savingsValue: "↓ 100%",
    description:
      "Client budget is locked on-chain before work starts — providers can't be ghosted.",
    higherIsBetter: false,
  },
  {
    label: "Scope Transparency",
    offerhub: "100%",
    traditional: "0%",
    icon: Eye,
    savingsLabel: "Auditability",
    savingsValue: "On-chain",
    description:
      "Every milestone, approval, and resolution is permanently recorded on-chain.",
    higherIsBetter: true,
  },
];

function AnimatedNumber({ value, mode }: { value: string; mode: Mode }) {
  const prevModeRef = useRef<Mode>(mode);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      setDisplay(value);
    }
  }, [value, mode]);

  return (
    <motion.span
      key={`${mode}-${value}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {display}
    </motion.span>
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
    <div className="inline-flex items-center rounded-full shadow-neu-raised-sm bg-bg-elevated p-1 gap-1">
      {(["offerhub", "traditional"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={cn(
            "relative z-10 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200",
            mode === m
              ? "text-bg-base"
              : "text-content-muted hover:text-content-secondary",
          )}
        >
          {mode === m && (
            <motion.span
              layoutId="service-platforms-toggle-bg"
              className="absolute inset-0 rounded-full bg-theme-primary"
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            />
          )}
          <span className="relative">
            {m === "offerhub" ? "Offer Hub" : "Traditional"}
          </span>
        </button>
      ))}
    </div>
  );
}

function SummaryBar({ mode }: { mode: Mode }) {
  return (
    <div className="flex items-center gap-3 py-4 px-6 md:px-8 rounded-2xl shadow-neu-sunken-subtle bg-bg-sunken">
      <div className="w-2 h-2 rounded-full bg-theme-primary animate-pulse flex-shrink-0" />
      {mode === "offerhub" ? (
        <p className="text-xs md:text-sm text-content-secondary leading-relaxed">
          Offer Hub{" "}
          <span className="text-content-primary font-bold">
            eliminates unpaid invoice risk entirely
          </span>{" "}
          and settles{" "}
          <span className="text-theme-primary font-bold">
            1,000,000× faster
          </span>{" "}
          than Net-30 terms — with every decision permanently on-chain.
        </p>
      ) : (
        <p className="text-xs md:text-sm text-content-secondary leading-relaxed">
          Traditional service billing relies on trust,{" "}
          <span className="text-content-primary font-bold">
            invoicing delays of 30–45 days
          </span>
          , and{" "}
          <span className="text-theme-warning font-bold">
            23% non-payment risk
          </span>{" "}
          — with no on-chain accountability.
        </p>
      )}
    </div>
  );
}

function MetricCardUI({
  metric,
  mode,
  index,
}: {
  metric: MetricCard;
  mode: Mode;
  index: number;
}) {
  const Icon = metric.icon;
  const value = mode === "offerhub" ? metric.offerhub : metric.traditional;
  const isGood =
    mode === "offerhub"
      ? metric.higherIsBetter ||
        metric.offerhub === "0%" ||
        metric.offerhub === "100%"
      : false;

  return (
    <motion.div
      className="flex-1 min-w-0 flex flex-col gap-4 p-6 md:p-8 rounded-[2rem] shadow-neu-raised bg-bg-elevated animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms` }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 rounded-xl shadow-neu-sunken-subtle bg-bg-base flex items-center justify-center text-theme-primary flex-shrink-0">
          <Icon size={20} />
        </div>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest rounded-full px-2.5 py-1 shadow-neu-raised-sm",
            isGood
              ? "bg-theme-success/12 text-theme-success"
              : "bg-theme-warning/12 text-theme-warning",
          )}
        >
          {metric.savingsValue}
        </span>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-content-muted mb-1">
          {metric.label}
        </p>
        <p
          className={cn(
            "text-3xl md:text-4xl font-extrabold tabular-nums leading-none",
            mode === "offerhub" ? "text-theme-primary" : "text-content-muted",
          )}
        >
          <AnimatedNumber value={value} mode={mode} />
        </p>
      </div>

      <p className="text-xs text-content-muted leading-relaxed mt-auto">
        {metric.description}
      </p>

      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            isGood ? "bg-theme-success" : "bg-theme-warning",
          )}
        />
        <span className="text-[10px] font-medium text-content-muted">
          {metric.savingsLabel}
        </span>
      </div>
    </motion.div>
  );
}

export default function StellarImpactCards() {
  const [mode, setMode] = useState<Mode>("offerhub");

  return (
    <div className="w-full flex flex-col items-center gap-6 md:gap-8">
      <ModeToggle mode={mode} onChange={setMode} />

      <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6">
        {METRICS.map((metric, i) => (
          <MetricCardUI
            key={metric.label}
            metric={metric}
            mode={mode}
            index={i}
          />
        ))}
      </div>

      <SummaryBar mode={mode} />
    </div>
  );
}
