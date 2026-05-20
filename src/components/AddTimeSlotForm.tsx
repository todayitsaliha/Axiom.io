import { useState } from 'react';
import { Subject, TimeSlot, DAYS } from '@/types/academic';

interface AddTimeSlotFormProps {
  subjects: Subject[];
  onAdd: (slot: Omit<TimeSlot, 'id'>) => void;
  onCancel: () => void;
}

export function AddTimeSlotForm({ subjects, onAdd, onCancel }: AddTimeSlotFormProps) {
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [day, setDay] = useState<TimeSlot['day']>('Mon');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');

  const handleSubmit = () => {
    if (!subjectId || !startTime || !endTime) return;
    onAdd({ subjectId, day, startTime, endTime, room: room.trim() || undefined });
  };

  return (
    <div className="border border-border bg-paper2/50 p-4 animate-fade-in">
      <div className="text-[8px] tracking-[0.15em] uppercase text-teal mb-3">Add Time Slot</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[9px] text-mid tracking-wider uppercase block mb-1">Subject</label>
          <select
            className="w-full bg-paper border border-border px-2 py-1.5 text-[11px] outline-none focus:border-teal"
            value={subjectId}
            onChange={e => setSubjectId(e.target.value)}
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[9px] text-mid tracking-wider uppercase block mb-1">Day</label>
          <select
            className="w-full bg-paper border border-border px-2 py-1.5 text-[11px] outline-none focus:border-teal"
            value={day}
            onChange={e => setDay(e.target.value as TimeSlot['day'])}
          >
            {DAYS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[9px] text-mid tracking-wider uppercase block mb-1">Start Time</label>
          <input
            type="time"
            className="w-full bg-paper border border-border px-2 py-1.5 text-[11px] outline-none focus:border-teal"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[9px] text-mid tracking-wider uppercase block mb-1">End Time</label>
          <input
            type="time"
            className="w-full bg-paper border border-border px-2 py-1.5 text-[11px] outline-none focus:border-teal"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="text-[9px] text-mid tracking-wider uppercase block mb-1">Room (optional)</label>
          <input
            className="w-full bg-paper border border-border px-2 py-1.5 text-[11px] outline-none focus:border-teal"
            placeholder="e.g. Room 204"
            value={room}
            onChange={e => setRoom(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button onClick={handleSubmit} className="text-[9px] text-paper uppercase tracking-wider px-4 py-1.5 bg-teal hover:bg-teal-mid">Add</button>
        <button onClick={onCancel} className="text-[9px] text-mid uppercase tracking-wider px-4 py-1.5 hover:text-ink">Cancel</button>
      </div>
    </div>
  );
}
