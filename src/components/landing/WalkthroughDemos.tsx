import { cn } from '@/lib/utils';

/**
 * Static, presentation-only mirrors of real Axiom dashboard surfaces.
 * Match the production components visually (same tokens, layout, typography)
 * but render hardcoded data — no handlers, no state, no localStorage.
 * Used exclusively in the landing page walkthrough.
 */

const FrameLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute -top-2.5 left-3 px-1.5 bg-paper text-[8px] tracking-[0.2em] uppercase text-teal font-mono z-10">
    {children}
  </div>
);

const Frame = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="relative">
    <FrameLabel>{label}</FrameLabel>
    <div className="border border-ink/15 bg-paper shadow-[0_20px_60px_-30px_hsl(var(--ink)/0.4)]">
      {children}
    </div>
  </div>
);

/* ───────────── Step 1: Onboarding profile form ───────────── */
export function DemoOnboarding() {
  return (
    <Frame label="Setup screen">
      <div className="bg-ink p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 bg-teal flex items-center justify-center">
            <span className="font-serif text-xs font-black text-paper">A</span>
          </div>
          <span className="text-[10px] font-serif text-paper">Axiom</span>
        </div>
        <div className="text-[8px] tracking-[0.2em] uppercase text-teal mb-4">Setup Your Profile</div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[8px] text-paper/40 tracking-wider uppercase block mb-1">Your Name</label>
            <div className="bg-paper/5 border border-paper/10 px-2.5 py-2 text-[10px] text-paper">John Doe</div>
          </div>
          <div>
            <label className="text-[8px] text-paper/40 tracking-wider uppercase block mb-1">Semester</label>
            <div className="bg-paper/5 border border-paper/10 px-2.5 py-2 text-[10px] text-paper">Fall 2024</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] text-paper/40 tracking-wider uppercase block mb-1">Start</label>
              <div className="bg-paper/5 border border-paper/10 px-2.5 py-2 text-[10px] text-paper">Sep 02, 2024</div>
            </div>
            <div>
              <label className="text-[8px] text-paper/40 tracking-wider uppercase block mb-1">End</label>
              <div className="bg-paper/5 border border-paper/10 px-2.5 py-2 text-[10px] text-paper">Dec 20, 2024</div>
            </div>
          </div>
          <div className="w-full py-2 bg-teal text-paper text-[9px] uppercase tracking-[0.15em] text-center mt-1">
            Continue to Dashboard →
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ───────────── Step 2: Subject card with components ───────────── */
export function DemoSubjectCard() {
  return (
    <Frame label="Subjects tab">
      <div className="bg-paper">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-1 h-9 rounded-full bg-teal" />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-sm font-black tracking-tight text-ink">Linear Algebra</span>
              <span className="text-[8px] text-mid tracking-wider">MATH-204</span>
            </div>
            <div className="text-[8px] text-mid mt-0.5">3 credits · 3 components · Weight: 100%</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-serif text-xl font-black tracking-tighter text-ink">
              87.4<span className="text-[10px] font-light text-mid">%</span>
            </div>
            <div className="text-[8px] tracking-wider text-green">A-</div>
          </div>
        </div>
        <div className="px-4 pb-2">
          <div className="h-1 bg-paper3 w-full"><div className="h-full bg-teal" style={{ width: '70%' }} /></div>
        </div>

        {/* Components */}
        <div className="border-t border-border divide-y divide-border">
          {[
            { name: 'Quizzes', weight: 20, sub: 4, score: '92.0', earned: null },
            { name: 'Midterm', weight: 30, sub: 0, score: '85.0', earned: '85' },
            { name: 'Final', weight: 50, sub: 0, score: null, earned: '' },
          ].map((c, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center gap-3">
              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', c.score !== null ? 'bg-green' : 'bg-mid/30')} />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-medium text-ink flex items-center gap-1.5">
                  {c.name}
                  {c.sub > 0 && <span className="text-[8px] text-mid">({c.sub} items)</span>}
                </div>
                <div className="text-[8px] text-mid">
                  Weight: {c.weight}%{c.score && ` · Avg: ${c.score}%`}
                </div>
              </div>
              {c.earned !== null && c.sub === 0 && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-12 bg-paper2 border border-border px-1.5 py-1 text-[10px] font-mono text-center">{c.earned || '—'}</div>
                  <span className="text-[8px] text-mid">/ 100</span>
                </div>
              )}
              {c.score && <div className="text-[10px] font-mono text-teal flex-shrink-0">{c.score}%</div>}
            </div>
          ))}
        </div>

        <div className="px-4 py-2.5 border-t border-border bg-paper2 flex items-center justify-between">
          <span className="text-[8px] text-mid uppercase tracking-wider">Predicted Final</span>
          <span className="font-serif text-base font-black text-ink tracking-tight">
            87.4% <span className="text-[8px] font-mono font-normal text-mid">(A-)</span>
          </span>
        </div>
      </div>
    </Frame>
  );
}

/* ───────────── Step 3: Timetable widget ───────────── */
export function DemoTimetable() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = [9, 10, 11, 14];
  // sparse schedule: [day, startHour, span, code, color, room]
  const slots: Array<[string, number, number, string, string, string]> = [
    ['Mon', 9, 2, 'MATH-204', 'teal', 'B-201'],
    ['Tue', 10, 1, 'CS-301', 'amber', 'A-104'],
    ['Wed', 9, 1, 'MATH-204', 'teal', 'B-201'],
    ['Wed', 14, 1, 'PHY-110', 'red', 'C-330'],
    ['Thu', 11, 1, 'CS-301', 'amber', 'A-104'],
    ['Fri', 10, 2, 'PHY-110', 'red', 'C-330'],
  ];
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    teal: { bg: 'bg-teal-pale', border: 'border-l-2 border-l-teal', text: 'text-[#0d5254]' },
    amber: { bg: 'bg-amber-pale', border: 'border-l-2 border-l-amber', text: 'text-[#7a4a10]' },
    red: { bg: 'bg-red-pale', border: 'border-l-2 border-l-red', text: 'text-[#8a2020]' },
  };
  const findSlot = (day: string, h: number) => slots.find(([d, sh, span]) => d === day && h >= sh && h < sh + span);
  const isStart = (day: string, h: number) => slots.some(([d, sh]) => d === day && h === sh);
  const today = 'Wed';

  return (
    <Frame label="Timetable widget">
      <div className="bg-paper">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="font-serif text-sm font-black tracking-tight">
            This Week's <em className="text-teal italic">Timetable</em>
          </div>
          <span className="text-[8px] text-teal tracking-wider uppercase">Full schedule →</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: `40px repeat(${days.length}, 1fr)` }}>
          <div className="bg-paper2 border-r border-b border-border" />
          {days.map(d => (
            <div key={d} className={cn(
              'p-1.5 text-center text-[8px] tracking-[0.1em] uppercase border-r border-b border-border last:border-r-0',
              d === today ? 'text-teal bg-teal-pale font-medium' : 'text-mid bg-paper2'
            )}>
              {d} {d === today && '◉'}
            </div>
          ))}
          {hours.map(h => (
            <div key={h} className="contents">
              <div className="bg-paper2 border-r border-b border-border flex items-center justify-center text-[7px] text-mid">
                {h}–{h + 1}
              </div>
              {days.map(d => {
                const slot = findSlot(d, h);
                const start = slot && isStart(d, h);
                const c = slot ? colorMap[slot[4]] : null;
                return (
                  <div key={d + h} className={cn(
                    'border-r border-b border-border last:border-r-0 min-h-[36px] p-0.5',
                    d === today && 'bg-teal/[0.03]'
                  )}>
                    {start && c && slot && (
                      <div className={cn('h-full rounded-sm px-1 py-1 flex flex-col justify-center', c.bg, c.border)}>
                        <div className={cn('text-[8px] font-medium leading-tight', c.text)}>{slot[3]}</div>
                        <div className="text-[7px] opacity-70 mt-0.5">{slot[5]}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ───────────── Step 4: GPA + grade entry ───────────── */
export function DemoGradeEntry() {
  return (
    <Frame label="Grade entry → GPA">
      <div className="bg-paper">
        {/* GPA top */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="font-serif text-sm font-black tracking-tight">
              <em className="text-teal italic">GPA</em> Overview
            </div>
            <span className="text-[8px] text-mid tracking-[0.1em] uppercase">Semester</span>
          </div>
          <div className="font-serif text-[48px] font-black tracking-tighter leading-none text-ink">
            3.<em className="text-teal italic">68</em>
            <span className="text-sm font-light text-mid">/4.0</span>
          </div>
          <div className="flex gap-0 mt-3 border border-border">
            {[['MATH-204', '3.7', 'green'], ['CS-301', '4.0', 'green'], ['PHY-110', '3.3', 'green'], ['ENG-101', '3.0', 'amber']].map(([c, g, col], i) => (
              <div key={i} className="flex-1 px-2 py-1.5 border-r border-border last:border-r-0">
                <div className="text-[7px] tracking-[0.1em] uppercase text-mid truncate">{c}</div>
                <div className={cn('font-serif text-sm font-bold tracking-tight mt-0.5',
                  col === 'green' ? 'text-green' : 'text-amber')}>{g}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-component entry */}
        <div className="p-4 bg-paper2/40">
          <div className="text-[8px] tracking-[0.2em] uppercase text-mid mb-2">Quizzes (4 items)</div>
          <div className="flex flex-col gap-1">
            {[['Quiz 1', '18', '20', '90%'], ['Quiz 2', '17', '20', '85%'], ['Quiz 3', '19', '20', '95%'], ['Quiz 4', '', '20', '—']].map(([n, e, m, p], i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-paper border border-border">
                <div className={cn('w-1.5 h-1.5 rounded-full', e ? 'bg-green' : 'bg-mid/20')} />
                <div className="flex-1 text-[10px] text-ink">{n}</div>
                <div className={cn('w-10 px-1.5 py-0.5 text-[10px] font-mono text-center border',
                  e ? 'border-teal bg-teal-pale text-ink' : 'border-border bg-paper2 text-mid')}>{e || '—'}</div>
                <span className="text-[8px] text-mid">/ {m}</span>
                <span className={cn('text-[9px] font-mono w-8 text-right', e ? 'text-teal' : 'text-mid')}>{p}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[8px] text-teal text-center font-mono tracking-wider">
            ↑ Component avg auto-updates → 90%
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ───────────── Step 5: Daily attendance + notice ───────────── */
export function DemoDailyCheckIn() {
  return (
    <Frame label="Today on the dashboard">
      <div className="bg-paper">
        {/* Attendance check-in */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="font-serif text-sm font-black tracking-tight">
              <em className="text-teal italic">Attendance</em>
            </div>
            <span className="text-[8px] text-mid tracking-wider uppercase">Wed · check-in</span>
          </div>
          <div className="text-[8px] tracking-[0.1em] uppercase text-mid mb-2">Mark today's classes</div>
          <div className="flex flex-col gap-1.5">
            {[['MATH-204', '09:00–10:00', 'teal', 'present'], ['PHY-110', '14:00–15:00', 'red', null]].map(([code, time, color, status], i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-paper2 border border-border">
                <div className={cn('w-1.5 h-5 flex-shrink-0', color === 'teal' ? 'bg-teal' : 'bg-red')} />
                <div className="flex-1">
                  <div className="text-[9px] font-medium text-ink">{code}</div>
                  <div className="text-[7px] text-mid">{time}</div>
                </div>
                <div className="flex gap-1">
                  <div className={cn('text-[7px] tracking-wider uppercase px-1.5 py-1 border',
                    status === 'present' ? 'bg-teal text-paper border-teal' : 'bg-paper border-border text-mid')}>
                    Present
                  </div>
                  <div className="text-[7px] tracking-wider uppercase px-1.5 py-1 bg-paper border-border border text-mid">
                    Absent
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notice board sliver */}
        <div className="p-4">
          <div className="font-serif text-sm font-black tracking-tight mb-2">
            <em className="text-teal italic">Notices</em>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2 px-2 py-1.5 border-l-2 border-l-red bg-red-pale/40">
              <span className="text-[7px] uppercase tracking-wider text-red font-mono mt-0.5">Urgent</span>
              <div className="flex-1">
                <div className="text-[10px] text-ink font-medium">Quiz 4 — Linear Algebra</div>
                <div className="text-[8px] text-mid">Due tomorrow · MATH-204</div>
              </div>
            </div>
            <div className="flex items-start gap-2 px-2 py-1.5 border-l-2 border-l-amber bg-amber-pale/40">
              <span className="text-[7px] uppercase tracking-wider text-amber font-mono mt-0.5">Soon</span>
              <div className="flex-1">
                <div className="text-[10px] text-ink font-medium">Midterm — Physics 110</div>
                <div className="text-[8px] text-mid">In 5 days · PHY-110</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

export const STEP_DEMOS = [DemoOnboarding, DemoSubjectCard, DemoTimetable, DemoGradeEntry, DemoDailyCheckIn];
