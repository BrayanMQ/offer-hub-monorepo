"use client";

import CodeIntegrationShowcase from "@/components/use-cases/freelance/CodeIntegrationShowcase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState, useEffect, useRef, useCallback } from "react";
import {
    Users,
    ShieldCheck,
    Zap,
    Globe,
    BarChart3,
    Code2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import EscrowFlowDiagram from "@/components/use-cases/freelance/EscrowFlowDiagram";
import FreelanceHero from "@/components/use-cases/freelance/FreelanceHero";
import StellarImpactCards from "@/components/use-cases/freelance/StellarImpactCards";

// ── Added "metrics" section to the nav ──
const PAGE_SECTIONS = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "features", label: "Features", icon: Zap },
    { id: "metrics", label: "Metrics", icon: BarChart3 },
    { id: "architecture", label: "Architecture", icon: Globe },
    { id: "sdk", label: "SDK", icon: Code2 },
] as const;

/** Offset (px) matching the sticky header height + breathing room */
const SCROLL_OFFSET = 140;

export default function UseCasesPage() {
    const [activeSection, setActiveSection] = useState<string>(PAGE_SECTIONS[0].id);
    const [isNavPinned, setIsNavPinned] = useState(false);
    const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);
    const [touchedId, setTouchedId] = useState<string | null>(null);

    const navRef = useRef<HTMLDivElement>(null);
    const pillContainerRef = useRef<HTMLDivElement>(null);
    const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

    const setLinkRef = useCallback((id: string, el: HTMLAnchorElement | null) => {
        if (el) linkRefs.current.set(id, el);
        else linkRefs.current.delete(id);
    }, []);

    const updatePillIndicator = useCallback(() => {
        const container = pillContainerRef.current;
        const activeLink = linkRefs.current.get(activeSection);
        if (!container || !activeLink) return;

        const containerRect = container.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        setPillStyle({
            left: linkRect.left - containerRect.left,
            width: linkRect.width,
        });
    }, [activeSection]);

    useEffect(() => {
        const sectionElements = PAGE_SECTIONS
            .map((s) => document.getElementById(s.id))
            .filter(Boolean) as HTMLElement[];

        if (sectionElements.length === 0) return;

        const visibilityMap = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    visibilityMap.set(entry.target.id, entry.intersectionRatio);
                });

                let bestId: string = activeSection;
                let bestRatio = -1;

                visibilityMap.forEach((ratio, id) => {
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        bestId = id;
                    }
                });

                if (bestRatio > 0.05 && bestId !== activeSection) {
                    setActiveSection(bestId);
                }
            },
            {
                threshold: [0, 0.1, 0.25, 0.4, 0.6, 0.75, 1],
                rootMargin: "-140px 0px -30% 0px",
            }
        );

        sectionElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                if (navRef.current) {
                    setIsNavPinned(navRef.current.getBoundingClientRect().top <= 81);
                }
                ticking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        updatePillIndicator();
    }, [activeSection, updatePillIndicator]);

    useEffect(() => {
        const onResize = () => updatePillIndicator();
        window.addEventListener("resize", onResize, { passive: true });
        return () => window.removeEventListener("resize", onResize);
    }, [updatePillIndicator]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const target = document.getElementById(id);
        if (!target) return;

        const top = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
    };

    const handleTouchStart = (id: string) => setTouchedId(id);
    const handleTouchEnd = () => setTouchedId(null);

    return (
        <div className="bg-transparent min-h-[100dvh]">
            <Navbar />

            <main>
                <FreelanceHero />

                {/* ── Sticky Navigation (Neumorphic Pill) ── */}
                <div
                    ref={navRef}
                    className={cn(
                        "sticky z-40 pointer-events-none",
                        "top-[80px] py-6",
                        "md:top-[80px]",
                    )}
                >
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 flex justify-center">
                        <div
                            className={cn(
                                "pointer-events-auto relative flex items-center p-1.5 sm:p-2 rounded-2xl bg-bg-base",
                                "transition-shadow duration-500 will-change-[box-shadow]",
                                isNavPinned ? "shadow-neu-raised-scrolled" : "shadow-neu-raised"
                            )}
                        >
                            <div
                                ref={pillContainerRef}
                                className="relative flex items-center gap-1 sm:gap-2"
                            >
                                {pillStyle && (
                                    <span
                                        className="absolute top-0 h-full rounded-xl btn-neumorphic-primary pointer-events-none"
                                        aria-hidden="true"
                                        style={{
                                            left: pillStyle.left,
                                            width: pillStyle.width,
                                            transition: "left 350ms cubic-bezier(0.25, 1, 0.5, 1), width 300ms ease-out",
                                            willChange: "left, width",
                                        }}
                                    />
                                )}

                                {PAGE_SECTIONS.map((section) => {
                                    const isActive = activeSection === section.id;
                                    const isTouched = touchedId === section.id;
                                    const SectionIcon = section.icon;

                                    return (
                                        <a
                                            key={section.id}
                                            ref={(el) => setLinkRef(section.id, el)}
                                            id={`nav-link-${section.id}`}
                                            href={`#${section.id}`}
                                            onClick={(e) => handleNavClick(e, section.id)}
                                            onTouchStart={() => handleTouchStart(section.id)}
                                            onTouchEnd={handleTouchEnd}
                                            onTouchCancel={handleTouchEnd}
                                            className={cn(
                                                "relative z-10 flex items-center gap-1.5",
                                                "min-w-[44px] min-h-[44px] px-4 sm:px-6 py-2.5",
                                                "rounded-xl text-xs sm:text-sm font-bold",
                                                "transition-all duration-300 select-none",
                                                "touch-manipulation",
                                                isActive
                                                    ? "text-white"
                                                    : "text-content-secondary hover:text-content-primary",
                                                !isActive && "hover:shadow-neu-sunken-subtle",
                                                isTouched && !isActive && "shadow-neu-sunken-subtle scale-[0.96]",
                                            )}
                                        >
                                            <SectionIcon size={14} className="hidden sm:block flex-shrink-0" />
                                            {section.label}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Features Section ── */}
                <section
                    id="features"
                    className="py-24 relative bg-transparent"
                    style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="flex flex-col items-center text-center p-10 rounded-[2rem] bg-bg-elevated shadow-neu-raised hover:shadow-neu-raised-hover transition-all duration-300 ease-out group">
                                <div className="w-16 h-16 rounded-2xl shadow-neu-sunken-subtle bg-bg-base flex items-center justify-center mb-8 group-hover:shadow-neu-sunken transition-all duration-300 text-theme-primary">
                                    <ShieldCheck size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-content-primary">Trustless Escrow</h3>
                                <p className="text-sm font-medium leading-relaxed text-content-secondary">
                                    Lock client funds into secure smart contracts at project kick-off. Funds are guaranteed to exist, protecting both the freelancer and the client.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex flex-col items-center text-center p-10 rounded-[2rem] bg-bg-elevated shadow-neu-raised hover:shadow-neu-raised-hover transition-all duration-300 ease-out group">
                                <div className="w-16 h-16 rounded-2xl shadow-neu-sunken-subtle bg-bg-base flex items-center justify-center mb-8 group-hover:shadow-neu-sunken transition-all duration-300 text-theme-primary">
                                    <Zap size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-content-primary">Milestone Automation</h3>
                                <p className="text-sm font-medium leading-relaxed text-content-secondary">
                                    Trigger partial or full payments automatically when APIs dictate completion of deliverables, removing manual invoice friction.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex flex-col items-center text-center p-10 rounded-[2rem] bg-bg-elevated shadow-neu-raised hover:shadow-neu-raised-hover transition-all duration-300 ease-out group">
                                <div className="w-16 h-16 rounded-2xl shadow-neu-sunken-subtle bg-bg-base flex items-center justify-center mb-8 group-hover:shadow-neu-sunken transition-all duration-300 text-theme-primary">
                                    <Globe size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-content-primary">Global Payouts</h3>
                                <p className="text-sm font-medium leading-relaxed text-content-secondary">
                                    Settle funds instantly in USDC or fiat-backed stablecoins directly to the freelancer&apos;s wallet, bypassing multi-day bank transfer delays and high FX fees.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Metrics Section (Stellar Economic Advantage) ── */}
                <section
                    id="metrics"
                    className="py-24 relative bg-transparent"
                    style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        <StellarImpactCards />
                    </div>
                </section>

                {/* ── Architecture Section ── */}
                <section
                    id="architecture"
                    className="py-24 relative bg-transparent"
                    style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                >
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                        <div className="w-16 h-16 rounded-2xl shadow-neu-raised bg-bg-base mx-auto mb-8 flex items-center justify-center text-theme-primary">
                            <Users size={24} />
                        </div>

                        <h2
                            className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-content-primary"
                        >
                            How it works under the hood
                        </h2>

                        <p
                            className="text-lg font-medium max-w-2xl mx-auto mb-16 leading-relaxed text-content-secondary"
                        >
                            A simplified view of the smart contract interactions orchestrated by OFFER HUB APIs.
                        </p>

                        <EscrowFlowDiagram />
                    </div>
                </section>

                {/* ── SDK / Code Integration Section ── */}
                <section
                    id="sdk"
                    className="relative bg-transparent"
                    style={{ scrollMarginTop: `${SCROLL_OFFSET}px` }}
                >
                    <CodeIntegrationShowcase />
                </section>
            </main>

            <Footer />
        </div>
    );
}
