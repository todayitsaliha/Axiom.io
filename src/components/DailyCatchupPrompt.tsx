import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Subject, TimeSlot, GradingComponent } from '@/types/academic';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAttendance, todayKey, todayDay } from '@/hooks/useAttendance';
import { cn } from '@/lib/utils';

interface Props {
  subjects: Subject[];
  timetable: TimeSlot[];
  onUpdateComponent: (subjectId: string, componentId: string, updates: Partial<GradingComponent>) => void;
}

const barColors: Record<string, string> = {
  teal: 'bg-teal',
  amber: 'bg-amber',
  red: 'bg-red',
  ink: 'bg-ink',
};

export function DailyCatchupPrompt({ subjects, timetable, onUpdateComponent }: Props) {
  const date = todayKey();
  const day = todayDay();
  const { records, markAttendance } = useAttendance();
  const [promptedOn, setPromptedOn] = useLocalStorage<string>('axiom-catchup-prompted', '');
  const [open, setOpen] = useState(false);
  const [scoreInputs, setScoreInputs] = useState<Record<string, string>>({});

  const todayMarks = records[date] || {};

  const pendingClasses = useMemo(
    () => (timetable || [])
      .filter(t => t.day === day && !todayMarks[t.id])
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [timetable, day, todayMarks]
  );

  const pendingComponents = useMemo(() => {
    const items: { subject: Subject; component: GradingComponent }[] = [];
    const todayStr = date;
    subjects.forEach(sub => {
      sub.components.forEach(c => {
        if (c.dueDate && c.dueDate <= todayStr && c.earnedScore === null) {
          items.push({ subject: sub, component: c });
        }
      });
    });
    return items;
  }, [subjects, date]);

  useEffect(() => {
    if (promptedOn === date) return;
    if (pendingClasses.length === 0 && pendingComponents.length === 0) return;
    setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subjectFor = (slotId: string) => {
    const slot = timetable.find(t => t.id === slotId);
    return subjects.find(s => s.id === slot?.subjectId);
  };

  const handleClose = (stamp: boolean) => {
    if (stamp) setPromptedOn(date);
    setOpen(false);
  };

  const saveScore = (subjectId: string, comp: GradingComponent) => {
    const raw = scoreInputs[comp.id];
    const val = raw === '' || raw === undefined ? null : Number(raw);
    if (val === null || isNaN(val) || val < 0 || val > comp.maxScore) return;
    onUpdateComponent(subjectId, comp.id, { earnedScore: val });
    setScoreInputs(prev => {
      const next = { ...prev };
      delete next[comp.id];
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose(false)}>
      <DialogContent className="max-w-lg bg-paper border border-border p-0 gap-0">
        <DialogHeader className="px-5 py-4 border-b border-border">
          <DialogTitle className="font-serif text-base font-black tracking-tight text-ink text-left">
            Daily <em className="text-teal italic">catch-up</em>
          </DialogTitle>
          <div className="text-[9px] text-mid tracking-[0.1em] uppercase">Quick check before you start</div>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto custom-scroll">
          {pendingClasses.length > 0 && (
            <section className="px-5 py-4 border-b border-border">
              <div className="text-[9px] tracking-[0.1em] uppercase text-mid mb-3">Today's classes</div>
              <div className="flex flex-col gap-1.5">
                {pendingClasses.map(slot => {
                  const sub = subjectFor(slot.id);
                  return (
                    <div key={slot.id} className="flex items-center gap-2 px-2 py-1.5 bg-paper2 border border-border">
                      <div className={cn('w-1.5 h-7 flex-shrink-0', barColors[sub?.color || 'ink'])} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-ink truncate">{sub?.code || sub?.name || 'Class'}</div>
                        <div className="text-[9px] text-mid">{slot.startTime}–{slot.endTime}</div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => markAttendance(slot.id, date, 'present')}
                          className="text-[9px] tracking-wider uppercase px-2.5 py-1.5 border bg-paper border-border text-mid hover:border-teal hover:text-teal transition-colors"
                        >
                          Attended
                        </button>
                        <button
                          onClick={() => markAttendance(slot.id, date, 'absent')}
                          className="text-[9px] tracking-wider uppercase px-2.5 py-1.5 border bg-paper border-border text-mid hover:border-red hover:text-red transition-colors"
                        >
                          Missed
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {pendingComponents.length > 0 && (
            <section className="px-5 py-4">
              <div className="text-[9px] tracking-[0.1em] uppercase text-mid mb-3">Assignments & quizzes due</div>
              <div className="flex flex-col gap-1.5">
                {pendingComponents.map(({ subject, component }) => {
                  const isEditing = scoreInputs[component.id] !== undefined;
                  return (
                    <div key={component.id} className="flex items-center gap-2 px-2 py-1.5 bg-paper2 border border-border">
                      <div className={cn('w-1.5 h-7 flex-shrink-0', barColors[subject.color])} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-ink truncate">
                          {subject.code || subject.name} · {component.name}
                        </div>
                        <div className="text-[9px] text-mid">
                          Due {component.dueDate} · /{component.maxScore}
                        </div>
                      </div>
                      {isEditing ? (
                        <div className="flex gap-1 flex-shrink-0 items-center">
                          <input
                            autoFocus
                            type="number"
                            min={0}
                            max={component.maxScore}
                            value={scoreInputs[component.id]}
                            onChange={e => setScoreInputs(p => ({ ...p, [component.id]: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && saveScore(subject.id, component)}
                            placeholder="Score"
                            className="w-16 bg-paper border border-border px-2 py-1 text-[10px] font-mono outline-none focus:border-teal"
                          />
                          <button
                            onClick={() => saveScore(subject.id, component)}
                            className="text-[9px] tracking-wider uppercase px-2 py-1.5 bg-teal text-paper border border-teal"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => setScoreInputs(p => ({ ...p, [component.id]: '' }))}
                            className="text-[9px] tracking-wider uppercase px-2.5 py-1.5 border bg-paper border-border text-mid hover:border-teal hover:text-teal transition-colors"
                          >
                            Mark done
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-border bg-paper2">
          <button
            onClick={() => handleClose(false)}
            className="text-[9px] tracking-wider uppercase text-mid hover:text-ink transition-colors"
          >
            Remind me later
          </button>
          <button
            onClick={() => handleClose(true)}
            className="text-[9px] tracking-wider uppercase px-4 py-2 bg-ink text-paper hover:bg-ink/90 transition-colors"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
