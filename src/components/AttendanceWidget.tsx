import { Subject, TimeSlot, DAYS } from '@/types/academic';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface AttendanceWidgetProps {
  subjects: Subject[];
  timetable: TimeSlot[];
}

// Record per slot per date: { [date]: { [slotId]: 'present' | 'absent' } }
type AttendanceRecord = Record<string, Record<string, 'present' | 'absent'>>;

const barColors: Record<string, string> = {
  teal: 'bg-teal',
  amber: 'bg-amber',
  red: 'bg-red',
  ink: 'bg-ink',
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayDay(): TimeSlot['day'] {
  // JS: 0=Sun..6=Sat; our DAYS: Mon..Sun
  const idx = new Date().getDay();
  return (['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx]) as TimeSlot['day'];
}

export function AttendanceWidget({ subjects, timetable }: AttendanceWidgetProps) {
  const [records, setRecords] = useLocalStorage<AttendanceRecord>('axiom-attendance', {});

  const day = todayDay();
  const date = todayKey();
  const todayClasses = (timetable || [])
    .filter(t => t.day === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const todayMarks = records[date] || {};

  const mark = (slotId: string, value: 'present' | 'absent') => {
    setRecords(prev => ({
      ...prev,
      [date]: { ...(prev[date] || {}), [slotId]: value },
    }));
  };

  // Per-subject totals across all marked dates
  const perSubject = subjects.map(sub => {
    let attended = 0;
    let total = 0;
    Object.values(records).forEach(dayRec => {
      Object.entries(dayRec).forEach(([slotId, status]) => {
        const slot = timetable.find(t => t.id === slotId);
        if (slot && slot.subjectId === sub.id) {
          total += 1;
          if (status === 'present') attended += 1;
        }
      });
    });
    return {
      id: sub.id,
      name: sub.code || sub.name,
      color: sub.color,
      attended,
      total,
      pct: total > 0 ? Math.round((attended / total) * 100) : 0,
    };
  });

  const overallAttended = perSubject.reduce((s, a) => s + a.attended, 0);
  const overallTotal = perSubject.reduce((s, a) => s + a.total, 0);
  const overallPct = overallTotal > 0 ? Math.round((overallAttended / overallTotal) * 100) : 0;

  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (overallPct / 100) * circumference;

  const subjectFor = (slotId: string) => {
    const slot = timetable.find(t => t.id === slotId);
    return subjects.find(s => s.id === slot?.subjectId);
  };

  return (
    <div className="border border-border bg-paper">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="font-serif text-base font-black tracking-tight">
          <em className="text-teal italic">Attendance</em>
        </div>
        <span className="text-[9px] text-mid tracking-wider uppercase">{day} · check-in</span>
      </div>
      <div className="p-4">
        {subjects.length === 0 || timetable.length === 0 ? (
          <div className="text-[11px] text-mid py-4 text-center">
            Add subjects and a timetable to start tracking attendance.
          </div>
        ) : (
          <>
            {/* Today's check-in */}
            <div className="mb-4">
              <div className="text-[9px] tracking-[0.1em] uppercase text-mid mb-2">Mark today's classes</div>
              {todayClasses.length === 0 ? (
                <div className="text-[10px] text-mid py-2 px-2 bg-paper2 border border-border">
                  No classes scheduled today. Enjoy the break.
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {todayClasses.map(slot => {
                    const sub = subjectFor(slot.id);
                    const status = todayMarks[slot.id];
                    return (
                      <div key={slot.id} className="flex items-center gap-2 px-2 py-1.5 bg-paper2 border border-border">
                        <div className={cn('w-1.5 h-6 flex-shrink-0', barColors[sub?.color || 'ink'])} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-medium text-ink truncate">{sub?.code || sub?.name || 'Class'}</div>
                          <div className="text-[8px] text-mid">{slot.startTime}–{slot.endTime}</div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => mark(slot.id, 'present')}
                            className={cn(
                              'text-[8px] tracking-wider uppercase px-2 py-1 border transition-colors',
                              status === 'present'
                                ? 'bg-teal text-paper border-teal'
                                : 'bg-paper border-border text-mid hover:border-teal hover:text-teal'
                            )}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => mark(slot.id, 'absent')}
                            className={cn(
                              'text-[8px] tracking-wider uppercase px-2 py-1 border transition-colors',
                              status === 'absent'
                                ? 'bg-red text-paper border-red'
                                : 'bg-paper border-border text-mid hover:border-red hover:text-red'
                            )}
                          >
                            Absent
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ring + stats */}
            <div className="flex items-center gap-5 mb-4 pt-3 border-t border-border">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="hsl(var(--paper3))" strokeWidth="8" fill="none" />
                  <circle
                    cx="40" cy="40" r="32"
                    stroke="hsl(var(--teal))" strokeWidth="8" fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-serif text-lg font-black text-ink tracking-tight">{overallPct}%</div>
                  <div className="text-[7px] tracking-[0.1em] uppercase text-mid">Overall</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-[9px] text-mid">Classes attended</span>
                  <span className="text-[10px] font-medium text-ink">{overallAttended}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-[9px] text-mid">Total marked</span>
                  <span className="text-[10px] font-medium text-ink">{overallTotal}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-[9px] text-mid">Absences</span>
                  <span className="text-[10px] font-medium text-red">{overallTotal - overallAttended}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[9px] text-mid">Min required</span>
                  <span className="text-[10px] font-medium text-ink">75%</span>
                </div>
              </div>
            </div>

            {/* Per-subject bars */}
            {overallTotal > 0 && (
              <div className="flex flex-col gap-2">
                {perSubject.map(a => (
                  <div key={a.id} className="flex items-center gap-2">
                    <div className="text-[9px] text-mid w-16 flex-shrink-0 truncate">{a.name}</div>
                    <div className="flex-1 h-[5px] bg-paper3">
                      <div
                        className={cn('h-full transition-all duration-500', barColors[a.color])}
                        style={{ width: `${a.pct}%` }}
                      />
                    </div>
                    <div className={cn('text-[9px] w-8 text-right', a.total > 0 && a.pct < 75 ? 'text-red' : 'text-mid')}>
                      {a.total > 0 ? `${a.pct}%` : '—'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
