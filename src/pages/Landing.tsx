import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { STEP_DEMOS } from "@/components/landing/WalkthroughDemos";
import { Reveal } from "@/components/landing/Reveal";
import { cn } from "@/lib/utils";

const features = [
  {
    num: "01",
    tag: "Subjects",
    title: "Hierarchical grading",
    desc: "Define components like Quizzes, Midterm, Final — each with weights. Add sub-assessments (Quiz 1, Quiz 2…) and Axiom calculates everything.",
    icon: "◈",
  },
  {
    num: "02",
    tag: "Timetable",
    title: "Your week, mapped",
    desc: "Plot every lecture across the week. Color-coded by subject, with the current day highlighted on your dashboard.",
    icon: "⌗",
  },
  {
    num: "03",
    tag: "Attendance",
    title: "Daily check-in",
    desc: "Each day, mark which classes you attended. Axiom tracks your percentage per subject and warns you before it drops too low.",
    icon: "✓",
  },
  {
    num: "04",
    tag: "GPA Predictor",
    title: "Forecast your future",
    desc: "Enter marks as they come. See your projected grade, GPA, and exactly what you need on the final to hit your target.",
    icon: "∆",
  },
  {
    num: "05",
    tag: "Notices",
    title: "Auto-generated alerts",
    desc: "Every assignment, quiz, and exam you add becomes a notice — flagged urgent, soon, or done based on dates.",
    icon: "◉",
  },
  {
    num: "06",
    tag: "PWA",
    title: "Install anywhere",
    desc: "Add Axiom to your phone's home screen. Works offline. Loads instantly. No app store required.",
    icon: "⊡",
  },
];

const steps = [
  {
    n: "1",
    title: "Set up your profile",
    body: "Tell Axiom your name, current semester, and start/end dates. One screen, ten seconds.",
    actions: [
      'Click "Get Started" on the welcome screen',
      'Enter your full name and semester (e.g. "Fall 2024")',
      "Pick the start and end dates for the semester",
      'Hit "Continue to Dashboard" — you\'re in',
    ],
  },
  {
    n: "2",
    title: "Add your subjects",
    body: "For each course, define grading components and their weights. e.g. Quizzes 20%, Midterm 30%, Final 50%.",
    actions: [
      'Open the "Subjects" tab in the sidebar',
      'Click "+ Add Subject" and enter the course name & code',
      "Add components (Quizzes, Midterm, Final…) with weights totalling 100%",
      "Inside each component, add sub-assessments (Quiz 1, Quiz 2…) as they happen",
    ],
  },
  {
    n: "3",
    title: "Build your timetable",
    body: "Drop in your weekly schedule — day, time, room. Used for attendance and the dashboard widget.",
    actions: [
      'Go to the "Timetable" tab in the sidebar',
      'Click "+ Add Slot" and choose the subject',
      "Pick the day, start time, end time, and room",
      "Repeat for every recurring class in your week",
    ],
  },
  {
    n: "4",
    title: "Enter marks as you get them",
    body: "Add quiz scores, assignment grades, and exam results. Axiom rolls them up into your real-time GPA.",
    actions: [
      "Open a subject from the Subjects tab",
      "Find the relevant component and its sub-assessment",
      "Type in your obtained marks and total marks",
      "Watch the subject grade, GPA, and predictor update instantly",
    ],
  },
  {
    n: "5",
    title: "Stay ahead, every day",
    body: "Check your dashboard daily. Mark attendance. Watch the predictor. Hit your targets.",
    actions: [
      "Open the dashboard to see today's classes",
      "Tap Present / Absent on the Attendance widget for each class",
      "Review the Notice Board for upcoming quizzes and deadlines",
      "Use the Grade Predictor to see what you need on remaining assessments",
    ],
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("academic-dashboard");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.onboarded === true) setIsReturning(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const goStart = () => navigate("/app");
  const ctaLabel = isReturning ? "Open Dashboard" : "Launch Axiom";
  const navCtaLabel = isReturning ? "Open Dashboard →" : "Launch App →";

  return (
    <div className="min-h-screen bg-ink text-paper overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-ink/70 border-b border-paper/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal flex items-center justify-center">
              <span className="font-serif text-lg font-black text-paper tracking-tighter">
                A
              </span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-paper tracking-tight font-serif">
                Axiom
              </span>
              <span className="text-[8px] tracking-[0.2em] text-paper/35 uppercase">
                academic management
              </span>
            </div>
          </div>
          <button
            onClick={goStart}
            className="px-5 py-2 bg-paper text-ink text-[10px] uppercase tracking-[0.15em] hover:bg-teal hover:text-paper transition-colors"
          >
            {navCtaLabel}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-40 pb-40 px-4 md:px-8">
        {/* decorative bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, hsl(var(--teal) / 0.25), transparent 50%), radial-gradient(ellipse at 80% 70%, hsl(var(--amber) / 0.12), transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--paper)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--paper)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-[9px] tracking-[0.3em] uppercase text-teal-mid mb-6 animate-fade-in">
            ◆ Personal Academic Operating System
          </div>
          <h1
            className="font-serif font-black leading-[0.88] text-5xl md:text-7xl lg:text-8xl mb-8 animate-fade-in"
            style={{ letterSpacing: "-0.045em" }}
          >
            Take control
            <br />
            of your <em className="italic text-teal-mid">semester.</em>
          </h1>
          <p className="text-paper/60 text-base md:text-lg max-w-2xl leading-[1.8] mb-10 animate-fade-in">
            Axiom is a personal academic management system for students who
            refuse to guess. Track grades, predict GPA, manage attendance, and
            see exactly where you stand — all in one place.
          </p>
          <div className="flex flex-wrap gap-4 items-center animate-fade-in">
            <button
              onClick={goStart}
              className="group px-8 py-4 bg-teal text-paper text-[11px] uppercase tracking-[0.2em] hover:bg-teal-mid hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_hsl(var(--teal)/0.5)] transition-all duration-300 flex items-center gap-3"
            >
              {ctaLabel}
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </button>
            <a
              href="#features"
              className="px-8 py-4 border border-paper/15 text-[11px] uppercase tracking-[0.2em] hover:border-teal hover:text-teal hover:bg-paper/[0.02] transition-all duration-300"
            >
              See How It Works
            </a>
          </div>

          {/* Stats strip */}
          <div
            className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-px bg-paper/10 border border-paper/10 will-change-transform"
            style={{ transform: `translateY(${scrollY * -0.04}px)` }}
          >
            {[
              ["∞", "Subjects"],
              ["100%", "Yours, locally"],
              ["0", "Sign-up forms"],
              ["1", "Source of truth"],
            ].map(([k, v], i) => (
              <Reveal key={v} delay={i * 80}>
                <div className="bg-ink p-8 group hover:bg-paper/[0.02] transition-colors duration-500">
                  <div className="font-serif text-3xl md:text-4xl font-black text-teal-mid mb-2 group-hover:-translate-y-0.5 transition-transform duration-300">
                    {k}
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-paper/40">
                    {v}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative py-32 md:py-40 px-4 md:px-8 bg-paper text-ink"
      >
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-[9px] tracking-[0.3em] uppercase text-teal mb-4">
              ◆ Features
            </div>
            <h2
              className="font-serif font-black text-4xl md:text-6xl mb-6 leading-[0.95]"
              style={{ letterSpacing: "-0.04em" }}
            >
              Everything you need.
              <br />
              <em className="italic text-teal">Nothing you don't.</em>
            </h2>
            <p className="text-mid text-base max-w-2xl mb-20 leading-[1.8]">
              Six tightly-integrated tools that cover the entire academic
              workflow — from setup to grade prediction.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
            {features.map((f, i) => (
              <Reveal key={f.num} delay={(i % 3) * 100}>
                <div className="group bg-paper p-10 hover:bg-teal-pale transition-all duration-500 cursor-default h-full">
                  <div className="flex items-start justify-between mb-8">
                    <span className="text-4xl text-teal/40 group-hover:text-teal group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 inline-block">
                      {f.icon}
                    </span>
                    <span className="text-[9px] font-mono text-mid tracking-wider">
                      {f.num}
                    </span>
                  </div>
                  <div className="text-[8px] tracking-[0.25em] uppercase text-teal mb-3">
                    {f.tag}
                  </div>
                  <h3 className="font-serif text-2xl font-black tracking-tight mb-4 group-hover:translate-x-1 transition-transform duration-500">
                    {f.title}
                  </h3>
                  <p className="text-[12px] text-mid leading-[1.85]">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WALKTHROUGH */}
      <section className="relative py-32 md:py-40 px-4 md:px-8 bg-ink">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-[9px] tracking-[0.3em] uppercase text-teal-mid mb-4">
              ◆ Walkthrough
            </div>
            <h2
              className="font-serif font-black text-4xl md:text-6xl mb-24 text-paper leading-[0.95]"
              style={{ letterSpacing: "-0.04em" }}
            >
              From zero to <em className="italic text-teal-mid">tracked.</em>
            </h2>
          </Reveal>

          <div className="space-y-28 md:space-y-40">
            {steps.map((s, i) => {
              const Demo = STEP_DEMOS[i];
              const reverse = i % 2 === 1;
              return (
                <div
                  key={s.n}
                  className={cn(
                    "grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center",
                    reverse && "md:[&>*:first-child]:order-2",
                  )}
                >
                  {/* Copy */}
                  <Reveal delay={reverse ? 120 : 0}>
                    <div className="flex items-baseline gap-4 mb-5">
                      <span className="font-serif text-7xl md:text-8xl font-black text-teal-mid/30 leading-none">
                        {s.n}
                      </span>
                      <div className="text-[9px] tracking-[0.25em] uppercase text-teal-mid">
                        Step {s.n}
                      </div>
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl font-black text-paper tracking-tight mb-4">
                      {s.title}
                    </h3>
                    <p className="text-paper/55 text-sm leading-[1.85] mb-7 max-w-md">
                      {s.body}
                    </p>
                    <ol className="space-y-3.5">
                      {s.actions.map((a, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-paper/75 text-[13px] leading-[1.75] group"
                        >
                          <span className="flex-shrink-0 w-5 h-5 border border-teal-mid/40 text-teal-mid text-[10px] font-mono flex items-center justify-center mt-0.5 group-hover:bg-teal-mid group-hover:text-ink group-hover:border-teal-mid transition-colors duration-300">
                            {idx + 1}
                          </span>
                          <span className="group-hover:text-paper transition-colors duration-300">
                            {a}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </Reveal>

                  {/* Visual */}
                  <Reveal delay={reverse ? 0 : 120}>
                    <div
                      className="relative group will-change-transform"
                      style={{
                        transform: `translateY(${Math.sin((scrollY + i * 220) / 320) * 8}px)`,
                      }}
                    >
                      <div className="absolute -inset-6 bg-gradient-to-br from-teal/15 via-transparent to-amber/10 blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative transition-transform duration-500 group-hover:-translate-y-1">
                        {Demo && <Demo />}
                      </div>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>

          {/* Visual flow */}
          <Reveal>
            <div className="mt-32 md:mt-40 p-10 md:p-14 border border-paper/10 bg-paper/[0.03]">
              <div className="text-[9px] tracking-[0.3em] uppercase text-teal-mid mb-8 text-center">
                The Axiom Loop
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 text-center font-mono text-[10px] uppercase tracking-wider">
                {[
                  "Setup",
                  "Add subjects",
                  "Schedule",
                  "Track marks",
                  "Predict GPA",
                ].map((label, i, arr) => (
                  <div key={label} className="flex items-center gap-3 md:gap-5">
                    <div className="px-5 py-3 bg-teal text-paper hover:bg-teal-mid hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                      {label}
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-teal-mid text-lg">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-40 md:py-48 px-4 md:px-8 bg-paper text-ink overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--ink)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--ink)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <Reveal>
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="text-[9px] tracking-[0.3em] uppercase text-teal mb-8">
              ◆ Ready?
            </div>
            <h2
              className="font-serif font-black text-5xl md:text-7xl lg:text-8xl leading-[0.88] mb-10"
              style={{ letterSpacing: "-0.045em" }}
            >
              Stop guessing.
              <br />
              Start <em className="italic text-teal">knowing.</em>
            </h2>
            <p className="text-mid text-base md:text-lg max-w-xl mx-auto mb-14 leading-[1.8]">
              No accounts. No subscriptions. Your data stays on your device. Get
              the dashboard you wish your school gave you.
            </p>
            <button
              onClick={goStart}
              className="group px-12 py-5 bg-ink text-paper text-[11px] uppercase tracking-[0.25em] hover:bg-teal hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_hsl(var(--teal)/0.5)] transition-all duration-300 inline-flex items-center gap-4"
            >
              {ctaLabel}
              <span className="group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </button>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-ink border-t border-paper/10 py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-teal flex items-center justify-center">
              <span className="font-serif text-sm font-black text-paper">
                A
              </span>
            </div>
            <span className="text-[10px] text-paper/40 font-mono tracking-wider">
              Axiom · Personal Academic OS
            </span>
          </div>
          <div className="text-[9px] text-paper/30 uppercase tracking-[0.2em]">
            Built for students. By a student.
          </div>
        </div>
      </footer>
    </div>
  );
}
