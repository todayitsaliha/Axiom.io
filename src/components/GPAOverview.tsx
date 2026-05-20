import { Subject } from '@/types/academic';
import { calculateSemesterGPA, calculateCurrentGrade, getLetterGrade, getGPA } from '@/lib/gradeCalculator';

interface GPAOverviewProps {
  subjects: Subject[];
}

export function GPAOverview({ subjects }: GPAOverviewProps) {
  const gpa = calculateSemesterGPA(subjects);

  return (
    <div className="border border-border bg-paper">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="font-serif text-base font-black tracking-tight">
          <em className="text-teal italic">GPA</em> Overview
        </div>
        <span className="text-[9px] text-mid tracking-[0.1em] uppercase">This Semester</span>
      </div>
      <div className="p-5">
        <div className="font-serif text-[64px] font-black tracking-tighter leading-none text-ink">
          {gpa !== null ? (
            <>
              {Math.floor(gpa)}.<em className="text-teal italic">{(gpa % 1).toFixed(2).slice(2)}</em>
              <span className="text-lg font-light text-mid">/4.0</span>
            </>
          ) : (
            <span className="text-mid text-3xl">—</span>
          )}
        </div>

        {subjects.length > 0 && (
          <div className="flex gap-0 mt-4 border border-border">
            {subjects.slice(0, 4).map(sub => {
              const grade = calculateCurrentGrade(sub);
              const subGpa = grade !== null ? getGPA(grade) : null;
              return (
                <div key={sub.id} className="flex-1 px-3 py-2.5 border-r border-border last:border-r-0">
                  <div className="text-[8px] tracking-[0.1em] uppercase text-mid truncate">{sub.code}</div>
                  <div className="font-serif text-base font-bold tracking-tight mt-0.5">
                    {subGpa !== null ? (
                      <span className={subGpa >= 3.0 ? 'text-green' : subGpa >= 2.0 ? 'text-amber' : 'text-red'}>
                        {subGpa.toFixed(1)}
                      </span>
                    ) : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
