import { Subject } from '@/types/academic';
import { calculateCurrentGrade, getColorForGrade } from '@/lib/gradeCalculator';
import { cn } from '@/lib/utils';

interface SubjectProgressProps {
  subjects: Subject[];
}

const fillColorMap = {
  teal: 'bg-teal',
  amber: 'bg-amber',
  red: 'bg-red',
  ink: 'bg-ink',
};

export function SubjectProgress({ subjects }: SubjectProgressProps) {
  return (
    <div className="border border-border bg-paper">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="font-serif text-base font-black tracking-tight">
          Subject <em className="text-teal italic">Progress</em>
        </div>
        <span className="text-[9px] text-mid tracking-[0.1em] uppercase">Current %</span>
      </div>
      <div className="p-4 flex flex-col gap-3.5">
        {subjects.length === 0 && (
          <div className="text-[11px] text-mid py-4 text-center">Add subjects to see progress</div>
        )}
        {subjects.map(sub => {
          const grade = calculateCurrentGrade(sub);
          const pct = grade ?? 0;
          const color = grade !== null ? getColorForGrade(pct) : 'ink';
          return (
            <div key={sub.id} className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-medium text-ink">{sub.name}</span>
                <span className="text-[10px] text-mid">{grade !== null ? `${pct.toFixed(0)}%` : '—'}</span>
              </div>
              <div className="h-1 bg-paper3 w-full">
                <div
                  className={cn('h-full transition-all duration-500', fillColorMap[color])}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
