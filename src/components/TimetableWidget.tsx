import { Subject, TimeSlot } from '@/types/academic';
import { cn } from '@/lib/utils';

interface TimetableWidgetProps {
  subjects: Subject[];
  timetable: TimeSlot[];
}

const WIDGET_HOURS = [8, 9, 10, 11, 14]; // compact view for dashboard
const WEEKDAYS: TimeSlot['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const blockColors: Record<string, { bg: string; border: string; text: string }> = {
  teal: { bg: 'bg-teal-pale', border: 'border-l-2 border-l-teal', text: 'text-[#0d5254]' },
  amber: { bg: 'bg-amber-pale', border: 'border-l-2 border-l-amber', text: 'text-[#7a4a10]' },
  red: { bg: 'bg-red-pale', border: 'border-l-2 border-l-red', text: 'text-[#8a2020]' },
  ink: { bg: 'bg-ink/5', border: 'border-l-2 border-l-ink', text: 'text-ink' },
};

export function TimetableWidget({ subjects, timetable }: TimetableWidgetProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  const getSlotForCell = (day: TimeSlot['day'], hour: number) => {
    return timetable.find(slot => {
      const startH = parseInt(slot.startTime.split(':')[0]);
      const endH = parseInt(slot.endTime.split(':')[0]);
      const endM = parseInt(slot.endTime.split(':')[1] || '0');
      const effectiveEnd = endM > 0 ? endH + 1 : endH;
      return slot.day === day && hour >= startH && hour < effectiveEnd;
    });
  };

  const isSlotStart = (slot: TimeSlot, hour: number) => {
    return parseInt(slot.startTime.split(':')[0]) === hour;
  };

  return (
    <div className="border border-border bg-paper">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="font-serif text-base font-black tracking-tight">
          This Week's <em className="text-teal italic">Timetable</em>
        </div>
        <span className="text-[9px] text-teal tracking-wider uppercase cursor-pointer hover:text-teal-mid">Full schedule →</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: `50px repeat(${WEEKDAYS.length}, 1fr)` }}>
        {/* Header */}
        <div className="bg-paper2 border-r border-b border-border" />
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className={cn(
              'p-2 text-center text-[9px] tracking-[0.1em] uppercase border-r border-b border-border last:border-r-0',
              today.startsWith(day) ? 'text-teal bg-teal-pale font-medium' : 'text-mid bg-paper2'
            )}
          >
            {day} {today.startsWith(day) && '◉'}
          </div>
        ))}

        {/* Rows */}
        {WIDGET_HOURS.map(hour => (
          <>
            <div key={`t-${hour}`} className="bg-paper2 border-r border-b border-border flex items-center justify-center text-[8px] text-mid tracking-wider">
              {hour}–{hour + 1}
            </div>
            {WEEKDAYS.map(day => {
              const slot = getSlotForCell(day, hour);
              const isToday = today.startsWith(day);
              const sub = slot ? getSubject(slot.subjectId) : null;
              const showSlot = slot && isSlotStart(slot, hour) && sub;
              const colors = sub ? blockColors[sub.color] || blockColors.teal : blockColors.teal;

              return (
                <div
                  key={`${day}-${hour}`}
                  className={cn(
                    'border-r border-b border-border last:border-r-0 min-h-[44px] p-0.5',
                    isToday && 'bg-teal/[0.03]'
                  )}
                >
                  {showSlot && (
                    <div className={cn('h-full rounded-sm px-1.5 py-1 flex flex-col justify-center', colors.bg, colors.border)}>
                      <div className={cn('text-[9px] font-medium leading-tight', colors.text)}>{sub.code}</div>
                      {slot.room && <div className="text-[8px] opacity-70 mt-0.5">{slot.room}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
