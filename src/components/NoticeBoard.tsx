import { Subject } from '@/types/academic';

interface NoticeBoardProps {
  subjects: Subject[];
}

type NoticeTag = 'exam' | 'quiz' | 'assignment' | 'done';

const tagStyles: Record<NoticeTag, string> = {
  exam: 'bg-red-pale text-red',
  quiz: 'bg-amber-pale text-[#7a4a10]',
  assignment: 'bg-teal-pale text-teal',
  done: 'bg-ink/[0.07] text-mid',
};

function classifyTag(name: string, isDone: boolean): NoticeTag {
  if (isDone) return 'done';
  const n = name.toLowerCase();
  if (n.includes('exam') || n.includes('midterm') || n.includes('final')) return 'exam';
  if (n.includes('quiz') || n.includes('test')) return 'quiz';
  return 'assignment';
}

function formatWhen(due: string, isDone: boolean): string {
  if (isDone) return 'Submitted';
  const days = Math.ceil((new Date(due).getTime() - Date.now()) / 86400000);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days <= 7) return `Due in ${days} days`;
  return `Due ${new Date(due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export function NoticeBoard({ subjects }: NoticeBoardProps) {
  const notices = subjects
    .flatMap(s => (s.components || [])
      .filter(c => c.dueDate)
      .map(c => {
        const isDone = c.status === 'completed';
        return {
          id: c.id,
          tag: classifyTag(c.name, isDone),
          title: c.name,
          subject: s.name,
          due: c.dueDate!,
          isDone,
          ts: new Date(c.dueDate!).getTime(),
        };
      })
    )
    .sort((a, b) => {
      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
      return a.ts - b.ts;
    })
    .slice(0, 6);

  return (
    <div className="border border-border bg-paper">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="font-serif text-base font-black tracking-tight">
          Notice <em className="text-teal italic">Board</em>
        </div>
        <span className="text-[9px] text-mid tracking-wider uppercase">Auto-generated</span>
      </div>
      <div>
        {notices.length === 0 ? (
          <div className="px-5 py-8 text-[11px] text-mid text-center">
            No notices yet. Add assignments, quizzes, or exams to your subjects and they'll appear here.
          </div>
        ) : (
          notices.map(notice => (
            <div key={notice.id} className="px-5 py-3 border-b border-border last:border-b-0 hover:bg-paper2 transition-colors">
              <span className={`text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 inline-block mb-1 ${tagStyles[notice.tag]}`}>
                {notice.tag}
              </span>
              <div className="text-[11px] font-medium text-ink leading-snug">{notice.title}</div>
              <div className="text-[9px] text-mid mt-1">{formatWhen(notice.due, notice.isDone)} · {notice.subject}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
