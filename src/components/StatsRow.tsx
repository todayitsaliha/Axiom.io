import { Subject } from '@/types/academic';
import { calculateSemesterGPA, calculateCurrentGrade } from '@/lib/gradeCalculator';

interface StatsRowProps {
  subjects: Subject[];
}

export function StatsRow({ subjects }: StatsRowProps) {
  const gpa = calculateSemesterGPA(subjects);
  const totalCredits = subjects.reduce((s, sub) => s + sub.creditHours, 0);

  const completedComponents = subjects.flatMap(s => s.components).filter(c => c.earnedScore !== null).length;
  const totalComponents = subjects.flatMap(s => s.components).length;

  const atRisk = subjects.filter(s => {
    const g = calculateCurrentGrade(s);
    return g !== null && g < 60;
  }).length;

  const upcomingCount = subjects.flatMap(s => s.components).filter(c => c.earnedScore === null && c.dueDate).length;

  const stats = [
    {
      label: 'Current GPA',
      value: gpa !== null ? gpa.toFixed(2) : '—',
      sub: 'Out of 4.00 scale',
      highlight: true,
      trend: gpa !== null ? { text: `↑ ${gpa.toFixed(2)}`, type: 'up' as const } : null,
    },
    {
      label: 'Assignments Due',
      value: String(upcomingCount),
      sub: upcomingCount > 0 ? `${upcomingCount} pending tasks` : 'All caught up',
      highlight: false,
      trend: upcomingCount > 2 ? { text: 'Urgent', type: 'down' as const } : upcomingCount > 0 ? { text: '⚠ Due soon', type: 'neutral' as const } : { text: '✓ Clear', type: 'up' as const },
    },
    {
      label: 'Components Done',
      value: `${completedComponents}/${totalComponents}`,
      sub: totalComponents > 0 ? `${Math.round((completedComponents / totalComponents) * 100)}% complete` : 'No components',
      highlight: false,
      trend: totalComponents > 0 ? { text: `${Math.round((completedComponents / totalComponents) * 100)}%`, type: completedComponents / totalComponents > 0.5 ? 'up' as const : 'neutral' as const } : null,
    },
    {
      label: 'Credit Hours',
      value: String(totalCredits),
      sub: `${subjects.length} courses this semester`,
      highlight: false,
      trend: atRisk > 0 ? { text: `${atRisk} at risk`, type: 'down' as const } : { text: 'On track', type: 'up' as const },
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mb-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`relative overflow-hidden p-4 md:p-5 transition-colors cursor-default ${
            stat.highlight ? 'bg-teal hover:bg-teal-mid' : 'bg-paper hover:bg-paper2'
          }`}
        >
          <div className={`text-[8px] tracking-[0.15em] uppercase mb-2 ${
            stat.highlight ? 'text-paper/60' : 'text-mid'
          }`}>
            {stat.label}
          </div>
          <div className={`font-serif text-2xl md:text-[34px] font-black tracking-tighter leading-none ${
            stat.highlight ? 'text-paper' : 'text-ink'
          }`}>
            {stat.highlight && gpa !== null ? (
              <>
                {Math.floor(gpa)}.<em className="italic text-amber">{(gpa % 1).toFixed(2).slice(2)}</em>
              </>
            ) : stat.value}
          </div>
          <div className={`text-[9px] mt-1 tracking-wider ${
            stat.highlight ? 'text-paper/50' : 'text-mid'
          }`}>
            {stat.sub}
          </div>
          {stat.trend && (
            <div className={`absolute top-3 right-3 md:top-4 md:right-4 text-[9px] tracking-wider px-2 py-0.5 ${
              stat.highlight ? 'bg-paper/15 text-paper' :
              stat.trend.type === 'up' ? 'bg-green-pale text-green' :
              stat.trend.type === 'down' ? 'bg-red-pale text-red' :
              'bg-amber-pale text-[#8a5c1a]'
            }`}>
              {stat.trend.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
