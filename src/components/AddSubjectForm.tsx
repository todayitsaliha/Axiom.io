import { useState } from 'react';

interface AddSubjectFormProps {
  onAdd: (subject: { name: string; code: string; creditHours: number; components: any[]; }) => void;
  onCancel: () => void;
}

export function AddSubjectForm({ onAdd, onCancel }: AddSubjectFormProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState('3');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      code: code.trim() || name.slice(0, 3).toUpperCase(),
      creditHours: parseInt(credits) || 3,
      components: [],
    });
  };

  return (
    <div className="border border-teal bg-teal-pale p-5 animate-fade-in">
      <div className="text-[8px] tracking-[0.15em] uppercase text-teal mb-3 font-medium">New Subject</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input
          placeholder="Subject Name"
          className="col-span-2 bg-paper border border-border px-3 py-2 text-[11px] font-mono outline-none focus:border-teal"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
        <input
          placeholder="Code"
          className="bg-paper border border-border px-3 py-2 text-[11px] font-mono outline-none focus:border-teal"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-mid">Credits:</span>
          <input
            type="number"
            className="w-12 bg-paper border border-border px-2 py-1.5 text-[11px] font-mono text-center outline-none focus:border-teal"
            value={credits}
            onChange={e => setCredits(e.target.value)}
            min={1}
            max={6}
          />
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={handleSubmit} className="text-[9px] text-paper uppercase tracking-wider px-4 py-1.5 bg-teal hover:bg-teal-mid">
            Create
          </button>
          <button onClick={onCancel} className="text-[9px] text-mid uppercase tracking-wider">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
