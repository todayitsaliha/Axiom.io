import { useState } from 'react';
import { Subject, TimeSlot, DAYS } from '@/types/academic';
import { AddTimeSlotForm } from './AddTimeSlotForm';
import { cn } from '@/lib/utils';

interface TimetableProps {
  subjects: Subject[];
  timetable: TimeSlot[];
  onAddTimeSlot: (slot: Omit<TimeSlot, 'id'>) => void;
  onRemoveTimeSlot: (id: string) => void;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 - 20:00

const colorMap: Record<string, string> = {
  teal: 'bg-teal/20 border-teal/40 text-teal',
  amber: 'bg-amber/20 border-amber/40 text-amber',
  red: 'bg-red/20 border-red/40 text-red',
  ink: 'bg-ink/10 border-ink/20 text-ink',
};

export function Timetable({ subjects, timetable, onAddTimeSlot, onRemoveTimeSlot }: TimetableProps) {
  const [showAdd, setShowAdd] = useState(false);

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  const getSlotsForCell = (day: TimeSlot['day'], hour: number) => {
    return timetable.filter(slot => {
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="font-serif text-xl font-black tracking-tight">
          Weekly <em className="text-teal italic">Timetable</em>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="text-[9px] text-paper uppercase tracking-wider px-4 py-2 bg-teal hover:bg-teal-mid"
        >
          + Add Time Slot
        </button>
      </div>

      {showAdd && (
        <div className="mb-4">
          <AddTimeSlotForm
            subjects={subjects}
            onAdd={(slot) => { onAddTimeSlot(slot); setShowAdd(false); }}
            onCancel={() => setShowAdd(false)}
          />
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="border border-border border-dashed bg-paper2/50 py-12 flex flex-col items-center gap-2">
          <div className="text-mid text-3xl">▦</div>
          <div className="text-[11px] text-mid">Add subjects first, then build your weekly schedule.</div>
        </div>
      ) : (
        <div className="border border-border bg-paper overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="text-[8px] tracking-[0.15em] uppercase text-mid p-2 border-b border-r border-border w-16 text-left">Time</th>
                {DAYS.map(day => (
                  <th key={day} className="text-[9px] tracking-wider uppercase text-ink font-medium p-2 border-b border-r border-border last:border-r-0 text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map(hour => (
                <tr key={hour} className="hover:bg-paper2/30">
                  <td className="text-[9px] text-mid p-2 border-r border-b border-border align-top font-mono">
                    {String(hour).padStart(2, '0')}:00
                  </td>
                  {DAYS.map(day => {
                    const slots = getSlotsForCell(day, hour);
                    return (
                      <td key={day} className="border-r border-b border-border last:border-r-0 p-0.5 align-top h-10 relative">
                        {slots.map(slot => {
                          if (!isSlotStart(slot, hour)) return null;
                          const sub = getSubject(slot.subjectId);
                          if (!sub) return null;
                          const startH = parseInt(slot.startTime.split(':')[0]);
                          const endH = parseInt(slot.endTime.split(':')[0]);
                          const endM = parseInt(slot.endTime.split(':')[1] || '0');
                          const span = (endH - startH) + (endM > 0 ? 1 : 0);
                          return (
                            <div
                              key={slot.id}
                              className={cn(
                                'border px-1.5 py-1 mx-0.5 group cursor-default',
                                colorMap[sub.color] || colorMap.teal
                              )}
                              style={{ minHeight: `${span * 2.5}rem` }}
                            >
                              <div className="text-[9px] font-medium truncate">{sub.code}</div>
                              <div className="text-[8px] opacity-60">{slot.startTime}–{slot.endTime}</div>
                              {slot.room && <div className="text-[7px] opacity-50 mt-0.5">{slot.room}</div>}
                              <button
                                onClick={() => onRemoveTimeSlot(slot.id)}
                                className="text-[8px] opacity-0 group-hover:opacity-60 hover:opacity-100 absolute top-0.5 right-1"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
