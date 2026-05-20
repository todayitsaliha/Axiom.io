import { useState } from 'react';
import { Subject, GradingComponent, SubComponent } from '@/types/academic';
import {
  calculateCurrentGrade,
  predictFinalGrade,
  requiredForTarget,
  getLetterGrade,
  getWarnings,
  calculateOverallProgress,
  calculateComponentScore,
  totalWeight,
} from '@/lib/gradeCalculator';
import { cn } from '@/lib/utils';

interface SubjectCardProps {
  subject: Subject;
  onUpdateComponent: (componentId: string, updates: Partial<GradingComponent>) => void;
  onAddComponent: (component: Omit<GradingComponent, 'id'>) => void;
  onRemoveComponent: (componentId: string) => void;
  onUpdateSubject: (updates: Partial<Subject>) => void;
  onRemoveSubject: () => void;
  onAddSubComponent: (componentId: string, subComp: Omit<SubComponent, 'id'>) => void;
  onUpdateSubComponent: (componentId: string, subCompId: string, updates: Partial<SubComponent>) => void;
  onRemoveSubComponent: (componentId: string, subCompId: string) => void;
}

const progressColorMap = {
  teal: 'bg-teal',
  amber: 'bg-amber',
  red: 'bg-red',
  ink: 'bg-ink',
};

export function SubjectCard({
  subject, onUpdateComponent, onAddComponent, onRemoveComponent, onUpdateSubject, onRemoveSubject,
  onAddSubComponent, onUpdateSubComponent, onRemoveSubComponent,
}: SubjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComp, setNewComp] = useState({ name: '', weight: '', maxScore: '100', dueDate: '' });
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(subject.targetGrade?.toString() || '');
  const [expandedComps, setExpandedComps] = useState<Set<string>>(new Set());
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null);
  const [newSub, setNewSub] = useState({ name: '', maxScore: '100' });

  const currentGrade = calculateCurrentGrade(subject);
  const predicted = predictFinalGrade(subject);
  const progress = calculateOverallProgress(subject);
  const warnings = getWarnings(subject);
  const tw = totalWeight(subject.components);

  const toggleComp = (id: string) => {
    setExpandedComps(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddComponent = () => {
    const weight = parseFloat(newComp.weight);
    const maxScore = parseFloat(newComp.maxScore);
    if (!newComp.name || isNaN(weight) || isNaN(maxScore) || weight <= 0 || maxScore <= 0) return;
    onAddComponent({
      name: newComp.name,
      weight,
      maxScore,
      earnedScore: null,
      dueDate: newComp.dueDate || undefined,
      subComponents: [],
    });
    setNewComp({ name: '', weight: '', maxScore: '100', dueDate: '' });
    setShowAddForm(false);
  };

  const handleAddSubComponent = (compId: string) => {
    const maxScore = parseFloat(newSub.maxScore);
    if (!newSub.name || isNaN(maxScore) || maxScore <= 0) return;
    onAddSubComponent(compId, { name: newSub.name, maxScore, earnedScore: null });
    setNewSub({ name: '', maxScore: '100' });
    setAddingSubTo(null);
  };

  const handleSetTarget = () => {
    const val = parseFloat(targetInput);
    onUpdateSubject({ targetGrade: isNaN(val) ? undefined : val });
    setEditingTarget(false);
  };

  const required = subject.targetGrade ? requiredForTarget(subject, subject.targetGrade) : null;

  return (
    <div className="border border-border bg-paper animate-fade-in">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-paper2 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={cn('w-1 h-10 rounded-full', progressColorMap[subject.color])} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-black tracking-tight text-ink">{subject.name}</span>
            <span className="text-[9px] text-mid tracking-wider">{subject.code}</span>
          </div>
          <div className="text-[9px] text-mid mt-0.5">{subject.creditHours} credits · {subject.components.length} components · Weight: {tw}%</div>
        </div>
        <div className="text-right flex-shrink-0">
          {currentGrade !== null ? (
            <>
              <div className="font-serif text-2xl font-black tracking-tighter text-ink">
                {currentGrade.toFixed(1)}<span className="text-xs font-light text-mid">%</span>
              </div>
              <div className={cn('text-[9px] tracking-wider', currentGrade >= 80 ? 'text-green' : currentGrade >= 60 ? 'text-amber' : 'text-red')}>
                {getLetterGrade(currentGrade)}
              </div>
            </>
          ) : (
            <div className="text-[11px] text-mid">No grades yet</div>
          )}
        </div>
        <span className="text-mid text-xs ml-2">{expanded ? '▾' : '▸'}</span>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <div className="h-1 bg-paper3 w-full">
          <div className={cn('h-full transition-all duration-500', progressColorMap[subject.color])} style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="px-5 pb-3 flex flex-col gap-1">
          {warnings.map((w, i) => (
            <div key={i} className="text-[9px] text-red bg-red-pale px-2 py-1">{w}</div>
          ))}
        </div>
      )}

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-border">
          {/* Target Grade */}
          <div className="px-5 py-3 border-b border-border flex items-center gap-3">
            <span className="text-[9px] text-mid tracking-wider uppercase">Target Grade:</span>
            {editingTarget ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-16 bg-paper2 border border-border px-2 py-1 text-[11px] font-mono outline-none focus:border-teal"
                  value={targetInput}
                  onChange={e => setTargetInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSetTarget()}
                  placeholder="85"
                  min={0}
                  max={100}
                />
                <button onClick={handleSetTarget} className="text-[9px] text-teal uppercase tracking-wider">Set</button>
              </div>
            ) : (
              <button onClick={() => { setTargetInput(subject.targetGrade?.toString() || ''); setEditingTarget(true); }}
                className="text-[11px] text-teal font-medium">
                {subject.targetGrade ? `${subject.targetGrade}%` : 'Set target →'}
              </button>
            )}
            {required !== null && (
              <span className={cn('text-[9px] ml-auto', required > 100 ? 'text-red' : required > 90 ? 'text-amber' : 'text-green')}>
                Need {required.toFixed(1)}% on remaining
              </span>
            )}
          </div>

          {/* Components */}
          <div className="divide-y divide-border">
            {subject.components.map(comp => {
              const compScore = calculateComponentScore(comp);
              const hasSubs = (comp.subComponents || []).length > 0;
              const isExpanded = expandedComps.has(comp.id);
              const contribution = compScore !== null ? (compScore / 100 * comp.weight).toFixed(1) : '—';

              return (
                <div key={comp.id}>
                  <div className="px-5 py-3 flex items-center gap-3">
                    <div
                      className={cn('w-2 h-2 rounded-full flex-shrink-0 cursor-pointer', compScore !== null ? 'bg-green' : 'bg-mid/30')}
                      onClick={() => hasSubs && toggleComp(comp.id)}
                    />
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleComp(comp.id)}>
                      <div className="text-[11px] font-medium text-ink flex items-center gap-1.5">
                        {comp.name}
                        {hasSubs && <span className="text-[8px] text-mid">({comp.subComponents.length} items)</span>}
                        {hasSubs && <span className="text-mid text-[9px]">{isExpanded ? '▾' : '▸'}</span>}
                      </div>
                      <div className="text-[9px] text-mid">
                        Weight: {comp.weight}%
                        {compScore !== null && ` · Avg: ${compScore.toFixed(1)}%`}
                        {` · Contribution: ${contribution}/${comp.weight}`}
                        {comp.dueDate ? ` · Due: ${comp.dueDate}` : ''}
                      </div>
                    </div>
                    {!hasSubs && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="number"
                          className="w-14 bg-paper2 border border-border px-2 py-1 text-[11px] font-mono text-center outline-none focus:border-teal"
                          value={comp.earnedScore ?? ''}
                          onChange={e => {
                            const val = e.target.value === '' ? null : parseFloat(e.target.value);
                            onUpdateComponent(comp.id, { earnedScore: val });
                          }}
                          placeholder="—"
                          min={0}
                          max={comp.maxScore}
                        />
                        <span className="text-[9px] text-mid">/ {comp.maxScore}</span>
                      </div>
                    )}
                    {compScore !== null && (
                      <div className="text-[11px] font-mono text-teal flex-shrink-0">{compScore.toFixed(1)}%</div>
                    )}
                    <button onClick={() => onRemoveComponent(comp.id)} className="text-[9px] text-red hover:text-red/80 ml-1">✕</button>
                  </div>

                  {/* Sub-components */}
                  {hasSubs && isExpanded && (
                    <div className="bg-paper2/50 border-t border-border">
                      {comp.subComponents.map(sc => (
                        <div key={sc.id} className="px-8 py-2 flex items-center gap-3 border-b border-border/50 last:border-b-0">
                          <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', sc.earnedScore !== null ? 'bg-green' : 'bg-mid/20')} />
                          <div className="flex-1 min-w-0 text-[10px] text-ink">{sc.name}</div>
                          <input
                            type="number"
                            className="w-14 bg-paper border border-border px-2 py-1 text-[10px] font-mono text-center outline-none focus:border-teal"
                            value={sc.earnedScore ?? ''}
                            onChange={e => {
                              const val = e.target.value === '' ? null : parseFloat(e.target.value);
                              onUpdateSubComponent(comp.id, sc.id, { earnedScore: val });
                            }}
                            placeholder="—"
                            min={0}
                            max={sc.maxScore}
                          />
                          <span className="text-[8px] text-mid">/ {sc.maxScore}</span>
                          {sc.earnedScore !== null && (
                            <span className="text-[9px] font-mono text-teal">{((sc.earnedScore / sc.maxScore) * 100).toFixed(0)}%</span>
                          )}
                          <button onClick={() => onRemoveSubComponent(comp.id, sc.id)} className="text-[8px] text-red hover:text-red/80">✕</button>
                        </div>
                      ))}
                      {/* Add sub-component */}
                      {addingSubTo === comp.id ? (
                        <div className="px-8 py-2 flex items-center gap-2 border-t border-border/50">
                          <input placeholder="e.g. Quiz 1" className="flex-1 bg-paper border border-border px-2 py-1 text-[10px] font-mono outline-none focus:border-teal"
                            value={newSub.name} onChange={e => setNewSub(p => ({ ...p, name: e.target.value }))} />
                          <input placeholder="Max" type="number" className="w-14 bg-paper border border-border px-2 py-1 text-[10px] font-mono outline-none focus:border-teal"
                            value={newSub.maxScore} onChange={e => setNewSub(p => ({ ...p, maxScore: e.target.value }))} />
                          <button onClick={() => handleAddSubComponent(comp.id)} className="text-[8px] text-teal uppercase tracking-wider">Add</button>
                          <button onClick={() => setAddingSubTo(null)} className="text-[8px] text-mid uppercase">Cancel</button>
                        </div>
                      ) : (
                        <div className="px-8 py-2 border-t border-border/50">
                          <button onClick={() => { setAddingSubTo(comp.id); setNewSub({ name: '', maxScore: '100' }); }}
                            className="text-[8px] text-teal uppercase tracking-wider hover:text-teal-mid">+ Add Item</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show add sub button even when not expanded if no subs yet */}
                  {!hasSubs && isExpanded && (
                    <div className="bg-paper2/50 border-t border-border px-8 py-2">
                      {addingSubTo === comp.id ? (
                        <div className="flex items-center gap-2">
                          <input placeholder="e.g. Quiz 1" className="flex-1 bg-paper border border-border px-2 py-1 text-[10px] font-mono outline-none focus:border-teal"
                            value={newSub.name} onChange={e => setNewSub(p => ({ ...p, name: e.target.value }))} />
                          <input placeholder="Max" type="number" className="w-14 bg-paper border border-border px-2 py-1 text-[10px] font-mono outline-none focus:border-teal"
                            value={newSub.maxScore} onChange={e => setNewSub(p => ({ ...p, maxScore: e.target.value }))} />
                          <button onClick={() => handleAddSubComponent(comp.id)} className="text-[8px] text-teal uppercase tracking-wider">Add</button>
                          <button onClick={() => setAddingSubTo(null)} className="text-[8px] text-mid uppercase">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setAddingSubTo(comp.id); setNewSub({ name: '', maxScore: '100' }); }}
                          className="text-[8px] text-teal uppercase tracking-wider hover:text-teal-mid">+ Add Sub-items (e.g. Quiz 1, Quiz 2)</button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add component */}
          {showAddForm ? (
            <div className="px-5 py-3 border-t border-border bg-paper2">
              <div className="grid grid-cols-4 gap-2 mb-2">
                <input placeholder="Name (e.g. Quizzes)" className="col-span-2 bg-paper border border-border px-2 py-1.5 text-[11px] font-mono outline-none focus:border-teal"
                  value={newComp.name} onChange={e => setNewComp(p => ({ ...p, name: e.target.value }))} />
                <input placeholder="Weight %" type="number" className="bg-paper border border-border px-2 py-1.5 text-[11px] font-mono outline-none focus:border-teal"
                  value={newComp.weight} onChange={e => setNewComp(p => ({ ...p, weight: e.target.value }))} />
                <input placeholder="Max" type="number" className="bg-paper border border-border px-2 py-1.5 text-[11px] font-mono outline-none focus:border-teal"
                  value={newComp.maxScore} onChange={e => setNewComp(p => ({ ...p, maxScore: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2">
                <input placeholder="Due date (optional)" type="date" className="bg-paper border border-border px-2 py-1.5 text-[11px] font-mono outline-none focus:border-teal flex-1"
                  value={newComp.dueDate} onChange={e => setNewComp(p => ({ ...p, dueDate: e.target.value }))} />
                <button onClick={handleAddComponent} className="text-[9px] text-teal uppercase tracking-wider px-3 py-1.5 bg-teal-pale hover:bg-teal/20">Add</button>
                <button onClick={() => setShowAddForm(false)} className="text-[9px] text-mid uppercase tracking-wider">Cancel</button>
              </div>
              {tw + (parseFloat(newComp.weight) || 0) > 100 && (
                <div className="text-[9px] text-red mt-1">⚠ Total weight would exceed 100%</div>
              )}
            </div>
          ) : (
            <div className="px-5 py-3 border-t border-border flex items-center justify-between">
              <button onClick={() => setShowAddForm(true)} className="text-[9px] text-teal uppercase tracking-wider hover:text-teal-mid">
                + Add Component
              </button>
              <button onClick={onRemoveSubject} className="text-[9px] text-red uppercase tracking-wider hover:text-red/70">
                Remove Subject
              </button>
            </div>
          )}

          {/* Predicted */}
          {predicted !== null && (
            <div className="px-5 py-3 border-t border-border bg-paper2 flex items-center justify-between">
              <span className="text-[9px] text-mid uppercase tracking-wider">Predicted Final</span>
              <span className="font-serif text-lg font-black text-ink tracking-tight">
                {predicted.toFixed(1)}% <span className="text-[9px] font-mono font-normal text-mid">({getLetterGrade(predicted)})</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
