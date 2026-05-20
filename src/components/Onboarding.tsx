import { useState } from 'react';

interface OnboardingProps {
  onComplete: (name: string, semester: string, semesterStart?: string, semesterEnd?: string) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('');
  const [semesterStart, setSemesterStart] = useState('');
  const [semesterEnd, setSemesterEnd] = useState('');

  const handleFinish = () => {
    if (!name.trim() || !semester.trim()) return;
    onComplete(name.trim(), semester.trim(), semesterStart || undefined, semesterEnd || undefined);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-ink">
      <div className="w-full max-w-md mx-auto animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-8 h-8 bg-teal flex items-center justify-center">
            <span className="font-serif text-lg font-black text-paper tracking-tighter">A</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-paper tracking-tight font-serif">Axiom</span>
            <span className="text-[8px] tracking-[0.2em] text-paper/35 uppercase">academic management</span>
          </div>
        </div>

        {step === 0 && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="text-center">
              <h1 className="font-serif text-3xl font-black text-paper tracking-tight mb-2">
                Welcome to <em className="text-teal italic">Axiom</em>
              </h1>
              <p className="text-[11px] text-paper/50 leading-relaxed max-w-xs mx-auto">
                Your personal academic management system. Track grades, predict GPA, and take control of your semester.
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="px-8 py-2.5 bg-teal text-paper text-[10px] uppercase tracking-[0.15em] hover:bg-teal-mid transition-colors"
            >
              Get Started
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="bg-paper/5 border border-paper/10 p-8 animate-fade-in">
            <div className="text-[8px] tracking-[0.2em] uppercase text-teal mb-6">Setup Your Profile</div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="text-[9px] text-paper/40 tracking-wider uppercase block mb-1.5">Your Name</label>
                <input
                  className="w-full bg-paper/5 border border-paper/10 px-3 py-2.5 text-[11px] text-paper outline-none focus:border-teal placeholder:text-paper/20"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[9px] text-paper/40 tracking-wider uppercase block mb-1.5">Semester</label>
                <input
                  className="w-full bg-paper/5 border border-paper/10 px-3 py-2.5 text-[11px] text-paper outline-none focus:border-teal placeholder:text-paper/20"
                  placeholder="e.g. Fall 2024"
                  value={semester}
                  onChange={e => setSemester(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] text-paper/40 tracking-wider uppercase block mb-1.5">Start Date</label>
                  <input
                    type="date"
                    className="w-full bg-paper/5 border border-paper/10 px-3 py-2.5 text-[11px] text-paper outline-none focus:border-teal [color-scheme:dark]"
                    value={semesterStart}
                    onChange={e => setSemesterStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[9px] text-paper/40 tracking-wider uppercase block mb-1.5">End Date</label>
                  <input
                    type="date"
                    className="w-full bg-paper/5 border border-paper/10 px-3 py-2.5 text-[11px] text-paper outline-none focus:border-teal [color-scheme:dark]"
                    value={semesterEnd}
                    onChange={e => setSemesterEnd(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleFinish}
                disabled={!name.trim() || !semester.trim()}
                className="w-full py-2.5 bg-teal text-paper text-[10px] uppercase tracking-[0.15em] hover:bg-teal-mid transition-colors disabled:opacity-30 disabled:cursor-not-allowed mt-2"
              >
                Continue to Dashboard →
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-8">
          {[0, 1].map(i => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-teal' : 'bg-paper/15'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
