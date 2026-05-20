import { Subject } from '@/types/academic';
import { cn } from '@/lib/utils';

interface UpcomingAssignmentsProps {
  subjects: Subject[];
}

export function UpcomingAssignments({ subjects }: UpcomingAssignmentsProps) {
  const upcoming = subjects
    .flatMap(s => s.components
      .filter(c => c.dueDate)
      .map(c => ({ ...c, subjectName: s.name, color: s.color }))
    )
    .sort((a, b) => {
      // Completed items last
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    })
    .slice(0, 6);

  const getDaysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getUrgency = (days: number, status?: string) => {
    if (status === 'completed') return 'done';
    if (days < 0) return 'urgent';
    if (days <= 2) return 'urgent';
    if (days <= 7) return 'soon';
    return 'ok';
  };

  const indicatorColors = {
    urgent: 'bg-red',
    soon: 'bg-amber',
    ok: 'bg-green',
    done: 'bg-mid opacity-40',
  };

  const textColors = {
    urgent: 'text-red',
    soon: 'text-[#8a5c1a]',
    ok: 'text-green',
    done: 'text-mid',
  };

  const formatDue = (days: number, status?: string) => {
    if (status === 'completed') return 'Submitted';
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `${days} days`;
    const d = new Date(Date.now() + days * 86400000);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="border border-border bg-paper">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="font-serif text-base font-black tracking-tight">
          <em className="text-teal italic">Assignments</em>
        </div>
        <span className="text-[9px] text-teal tracking-wider uppercase cursor-pointer hover:text-teal-mid">All tasks →</span>
      </div>
      <div>
        {upcoming.length === 0 && (
          <div className="text-[11px] text-mid py-6 text-center">No upcoming assessments</div>
        )}
        {upcoming.map(item => {
          const days = getDaysUntil(item.dueDate!);
          const urgency = getUrgency(days, item.status);
          const isDone = item.status === 'completed';
          return (
            <div key={item.id} className="flex items-center gap-2.5 px-5 py-3 border-b border-border last:border-b-0 hover:bg-paper2 transition-colors cursor-pointer">
              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', indicatorColors[urgency])} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-ink truncate">{item.name}</div>
                <div className="text-[9px] text-mid mt-0.5">{item.subjectName}</div>
              </div>
              <div className={cn('text-[9px] tracking-wider text-right flex-shrink-0', textColors[urgency])}>
                {formatDue(days, item.status)}
              </div>
              <div className={cn(
                'w-4 h-4 border flex-shrink-0 flex items-center justify-center text-[9px]',
                isDone ? 'bg-green border-green text-paper' : 'border-border text-mid'
              )}>
                {isDone ? '✓' : '○'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
