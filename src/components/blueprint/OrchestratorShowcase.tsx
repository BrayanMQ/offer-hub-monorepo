"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, Command, Cpu, Shield, Workflow } from "lucide-react";

type LayerKey = "security" | "liquidity" | "logic";

type FlowNode = {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
};

type DetailCard = {
  key: LayerKey;
  title: string;
  eyebrow: string;
  icon: typeof Shield;
  summary: string;
  bullets: string[];
  callout: string;
  method: string;
  docHref: string;
  docLabel: string;
};

const flowNodes: FlowNode[] = [
  { id: "input", label: "Input", sublabel: "Fiat / Crypto", x: 120, y: 168 },
  { id: "orchestrator", label: "Orchestrator", sublabel: "Escrow / Vault", x: 360, y: 168 },
  { id: "output", label: "Output", sublabel: "Seller Settlement", x: 600, y: 168 },
];

const detailCards: DetailCard[] = [
  {
    key: "security",
    title: "Security Layer",
    eyebrow: "Trust boundary",
    icon: Shield,
    summary:
      "Every transfer is wrapped in encrypted instructions and isolated account contexts before funds ever reach the settlement path.",
    bullets: [
      "AES-256 protects payload metadata and settlement instructions while signatures preserve replay safety.",
      "Stellar account isolation keeps buyer escrow, bridge vault, and seller balances compartmentalized by role.",
      "prepare() validates participants and seeds the escrow envelope before authorization can continue.",
    ],
    callout: "The first gate guarantees the orchestrator never mixes custody states across counterparties.",
    method: "prepare()",
    docHref:
      "https://github.com/OFFER-HUB/offer-hub-monorepo/blob/main/docs/architecture/overview.md",
    docLabel: "Architecture overview",
  },
  {
    key: "liquidity",
    title: "Liquidity Engine",
    eyebrow: "Bridge + settlement rail",
    icon: Cpu,
    summary:
      "Trustlines and vault balances let OFFER-HUB route value from fiat on-ramp or crypto deposit into a stable USDC settlement layer.",
    bullets: [
      "USDC on Stellar acts as the neutral settlement asset for payouts and cross-rail accounting.",
      "Bridge liquidity is staged in vault accounts so conversion and seller release stay deterministic.",
      "authorize() locks approved liquidity paths and confirms the exact release conditions for the seller.",
    ],
    callout: "Liquidity is reserved before release, so the visible seller payout is backed by an available trustline path.",
    method: "authorize()",
    docHref:
      "https://github.com/OFFER-HUB/offer-hub-monorepo/blob/main/docs/architecture/payment-flows.md",
    docLabel: "Payment flows",
  },
  {
    key: "logic",
    title: "Logic Gate",
    eyebrow: "State machine control",
    icon: Workflow,
    summary:
      "A granular SDK state machine coordinates escrow creation, approval, dispute handling, and release with explicit transitions.",
    bullets: [
      "The SDK models each payment as a sequence of auditable states instead of a single opaque transaction.",
      "Granular transitions reduce ambiguity for refunds, partial completion, and dispute-triggered holds.",
      "finalize() commits the release, updates balances, and emits the terminal state for downstream reporting.",
    ],
    callout: "The SDK turns complex backend choreography into a small set of explicit method calls and irreversible checkpoints.",
    method: "finalize()",
    docHref:
      "https://github.com/OFFER-HUB/offer-hub-monorepo/blob/main/docs/architecture/data-model.md",
    docLabel: "Data model",
  },
];

function FlowLegend() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        {
          label: "prepare()",
          text: "Normalize buyer input, verify custody accounts, and initialize the escrow envelope.",
        },
        {
          label: "authorize()",
          text: "Confirm bridge liquidity, approve trustline movement, and lock release rules.",
        },
        {
          label: "finalize()",
          text: "Settle to the seller, persist final state, and expose the payout event downstream.",
        },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-[1.5rem] bg-bg-base p-4 shadow-neu-sunken text-left"
        >
          <div className="mb-2 inline-flex rounded-full bg-theme-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-theme-primary">
            {item.label}
          </div>
          <p className="text-sm leading-6 text-content-secondary">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function DataFlowDiagram() {
  return (
    <div className="rounded-[2rem] bg-bg-base p-4 shadow-neu-sunken md:p-6">
      <svg
        viewBox="0 0 720 336"
        className="h-full w-full"
        role="img"
        aria-label="OFFER-HUB orchestrator flow from input to escrow logic to seller settlement"
      >
        <defs>
          <linearGradient id="flowLine" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.25" />
          </linearGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          d="M 180 168 C 230 168, 250 168, 300 168"
          fill="none"
          stroke="url(#flowLine)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="8 12"
          className="animate-connectorDash"
        />
        <path
          d="M 420 168 C 470 168, 490 168, 540 168"
          fill="none"
          stroke="url(#flowLine)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="8 12"
          className="animate-connectorDash"
        />

        <path
          d="M 360 92 C 360 58, 360 58, 360 38"
          fill="none"
          stroke="var(--color-primary)"
          strokeOpacity="0.35"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 10"
          className="animate-connectorDash"
        />
        <path
          d="M 360 244 C 360 278, 360 278, 360 298"
          fill="none"
          stroke="var(--color-primary)"
          strokeOpacity="0.35"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 10"
          className="animate-connectorDash"
        />

        <rect
          x="280"
          y="18"
          width="160"
          height="42"
          rx="21"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border)"
          strokeOpacity="0.45"
        />
        <text
          x="360"
          y="35"
          textAnchor="middle"
          className="fill-current text-[12px] font-semibold uppercase tracking-[0.18em] text-content-secondary"
          style={{ fill: "var(--color-text-secondary)" }}
        >
          Fiat + Crypto rails
        </text>
        <text
          x="360"
          y="50"
          textAnchor="middle"
          className="fill-current text-[11px]"
          style={{ fill: "var(--color-text-muted)" }}
        >
          Deposits normalize into escrow-safe instructions
        </text>

        <rect
          x="268"
          y="276"
          width="184"
          height="42"
          rx="21"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border)"
          strokeOpacity="0.45"
        />
        <text
          x="360"
          y="293"
          textAnchor="middle"
          className="fill-current text-[12px] font-semibold uppercase tracking-[0.18em] text-content-secondary"
          style={{ fill: "var(--color-text-secondary)" }}
        >
          SDK state machine
        </text>
        <text
          x="360"
          y="308"
          textAnchor="middle"
          className="fill-current text-[11px]"
          style={{ fill: "var(--color-text-muted)" }}
        >
          prepare() {"->"} authorize() {"->"} finalize()
        </text>

        {flowNodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="66" fill="url(#nodeGlow)" className="animate-blockchainPulse" />
            <circle
              cx={node.x}
              cy={node.y}
              r="58"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border)"
              strokeOpacity="0.45"
              strokeWidth="2"
              style={{
                filter:
                  "drop-shadow(10px 10px 16px var(--shadow-dark)) drop-shadow(-10px -10px 16px var(--shadow-light))",
              }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="42"
              fill="var(--color-bg-base)"
              stroke="var(--color-border)"
              strokeOpacity="0.2"
            />
            <text
              x={node.x}
              y={node.y - 4}
              textAnchor="middle"
              className="fill-current text-[14px] font-semibold"
              style={{ fill: "var(--color-text-primary)" }}
            >
              {node.label}
            </text>
            <text
              x={node.x}
              y={node.y + 16}
              textAnchor="middle"
              className="fill-current text-[11px]"
              style={{ fill: "var(--color-text-secondary)" }}
            >
              {node.sublabel}
            </text>
          </g>
        ))}

        <g>
          <text
            x="240"
            y="150"
            textAnchor="middle"
            className="fill-current text-[11px] font-medium"
            style={{ fill: "var(--color-primary)" }}
          >
            prepare()
          </text>
          <text
            x="480"
            y="150"
            textAnchor="middle"
            className="fill-current text-[11px] font-medium"
            style={{ fill: "var(--color-primary)" }}
          >
            authorize()
          </text>
          <text
            x="600"
            y="246"
            textAnchor="middle"
            className="fill-current text-[11px] font-medium"
            style={{ fill: "var(--color-primary)" }}
          >
            finalize()
          </text>
          <path
            d="M 600 226 C 600 246, 600 246, 600 262"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeOpacity="0.35"
            strokeLinecap="round"
            strokeDasharray="6 10"
            className="animate-connectorDash"
          />
        </g>
      </svg>
    </div>
  );
}

function ArchitectureCard({
  card,
  expanded,
  onToggle,
}: {
  card: DetailCard;
  expanded: boolean;
  onToggle: () => void;
}) {
  const Icon = card.icon;

  return (
    <article className="rounded-[2rem] bg-bg-elevated p-8 shadow-neu-raised transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-[1.25rem] bg-bg-base p-3 shadow-neu-sunken-subtle">
            <Icon className="h-5 w-5 text-theme-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-theme-primary">
              {card.eyebrow}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-content-primary">{card.title}</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-bg-base text-content-secondary shadow-neu-raised-sm transition-transform duration-300 hover:text-theme-primary"
          aria-expanded={expanded}
          aria-controls={`${card.key}-details`}
        >
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <p className="mt-6 text-sm leading-7 text-content-secondary">{card.summary}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-theme-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-theme-primary">
          Core call: {card.method}
        </span>
        <span className="inline-flex items-center rounded-full bg-bg-base px-3 py-1 text-xs text-content-muted shadow-neu-sunken-subtle">
          Deep-dive available
        </span>
      </div>

      <div
        id={`${card.key}-details`}
        className={`grid transition-all duration-300 ${
          expanded ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70"
        }`}
      >
        <div className="overflow-hidden">
          <div className="rounded-[1.5rem] bg-bg-base p-5 shadow-neu-sunken">
            <p className="text-sm leading-7 text-content-primary">{card.callout}</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-content-secondary">
              {card.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-theme-primary" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <Link
              href={card.docHref}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-theme-primary transition-colors hover:text-theme-primary-hover"
            >
              Open {card.docLabel}
              <Command className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function OrchestratorShowcase() {
  const [expandedKey, setExpandedKey] = useState<LayerKey>("logic");

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] bg-bg-elevated p-10 shadow-neu-raised">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-bg-base px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-theme-primary shadow-neu-sunken">
                <Workflow className="h-4 w-4" />
                The Orchestrator
              </div>

              <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-content-primary md:text-5xl">
                Visualizing the invisible engine behind decentralized payments.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-content-secondary">
                This showcase turns escrow automation, vault custody, and payout sequencing into a
                flow you can read at a glance. OFFER-HUB ingests fiat or crypto, passes value
                through programmable escrow logic, and releases seller settlement only after the SDK
                state machine advances through its guarded checkpoints.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Input rails", value: "Fiat / Crypto" },
                  { label: "Custody core", value: "Escrow + Vault" },
                  { label: "Settlement", value: "Seller release" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.5rem] bg-bg-base p-4 shadow-neu-sunken">
                    <p className="text-xs uppercase tracking-[0.2em] text-content-muted">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-content-primary">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <DataFlowDiagram />
          </div>

          <div className="mt-10">
            <FlowLegend />
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            {detailCards.map((card) => (
              <ArchitectureCard
                key={card.key}
                card={card}
                expanded={expandedKey === card.key}
                onToggle={() =>
                  setExpandedKey((current) => (current === card.key ? "logic" : card.key))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
