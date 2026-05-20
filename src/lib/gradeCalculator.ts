import { Subject, GradingComponent, GRADE_SCALE } from '@/types/academic';

/** Calculate a component's score from its sub-components (average percentage) */
export function calculateComponentScore(comp: GradingComponent): number | null {
  const subs = comp.subComponents ?? [];
  if (subs.length === 0) {
    // Legacy: use earnedScore directly
    if (comp.earnedScore === null || comp.earnedScore === undefined) return null;
    return (comp.earnedScore / comp.maxScore) * 100;
  }
  const completed = subs.filter(sc => sc.earnedScore !== null && sc.earnedScore !== undefined);
  if (completed.length === 0) return null;
  const avgPct = completed.reduce((s, sc) => s + (sc.earnedScore! / sc.maxScore) * 100, 0) / completed.length;
  return avgPct;
}

/** Check if a component has any completed scores */
export function isComponentCompleted(comp: GradingComponent): boolean {
  const subs = comp.subComponents ?? [];
  if (subs.length === 0) return comp.earnedScore !== null && comp.earnedScore !== undefined;
  return subs.some(sc => sc.earnedScore !== null && sc.earnedScore !== undefined);
}

/** Check if a component is fully completed */
export function isComponentFullyCompleted(comp: GradingComponent): boolean {
  const subs = comp.subComponents ?? [];
  if (subs.length === 0) return comp.earnedScore !== null && comp.earnedScore !== undefined;
  return subs.every(sc => sc.earnedScore !== null && sc.earnedScore !== undefined);
}

/** Current grade based only on completed components */
export function calculateCurrentGrade(subject: Subject): number | null {
  const completed = subject.components.filter(c => isComponentCompleted(c));
  if (completed.length === 0) return null;
  const totalWeight = completed.reduce((s, c) => s + c.weight, 0);
  if (totalWeight === 0) return null;
  const weightedScore = completed.reduce((s, c) => {
    const score = calculateComponentScore(c);
    if (score === null) return s;
    return s + (score / 100) * c.weight;
  }, 0);
  return (weightedScore / totalWeight) * 100;
}

/** Predicted final grade assuming same performance on remaining */
export function predictFinalGrade(subject: Subject): number | null {
  const current = calculateCurrentGrade(subject);
  if (current === null) return null;
  return current;
}

/** Overall weighted percentage including all components (incomplete ones counted as 0) */
export function calculateOverallProgress(subject: Subject): number {
  return subject.components.reduce((s, c) => {
    const score = calculateComponentScore(c);
    if (score === null) return s;
    return s + (score / 100) * c.weight;
  }, 0);
}

/** Required percentage on remaining components to hit target */
export function requiredForTarget(subject: Subject, targetPct: number): number | null {
  const completed = subject.components.filter(c => isComponentCompleted(c));
  const remaining = subject.components.filter(c => !isComponentCompleted(c));
  if (remaining.length === 0) return null;

  const earnedWeighted = completed.reduce((s, c) => {
    const score = calculateComponentScore(c);
    if (score === null) return s;
    return s + (score / 100) * c.weight;
  }, 0);
  const remainingWeight = remaining.reduce((s, c) => s + c.weight, 0);
  if (remainingWeight === 0) return null;

  const needed = targetPct - earnedWeighted;
  return (needed / remainingWeight) * 100;
}

export function getLetterGrade(pct: number): string {
  for (const g of GRADE_SCALE) {
    if (pct >= g.minPct) return g.letter;
  }
  return 'F';
}

export function getGPA(pct: number): number {
  for (const g of GRADE_SCALE) {
    if (pct >= g.minPct) return g.gpa;
  }
  return 0;
}

export function calculateSemesterGPA(subjects: Subject[]): number | null {
  let totalCredits = 0;
  let totalPoints = 0;
  for (const sub of subjects) {
    const grade = calculateCurrentGrade(sub);
    if (grade === null) continue;
    const gpa = getGPA(grade);
    totalPoints += gpa * sub.creditHours;
    totalCredits += sub.creditHours;
  }
  if (totalCredits === 0) return null;
  return totalPoints / totalCredits;
}

export function getWarnings(subject: Subject): string[] {
  const warnings: string[] = [];
  const current = calculateCurrentGrade(subject);
  if (current !== null && current < 60) {
    warnings.push('⚠ Failing risk — current grade below 60%');
  }
  if (subject.targetGrade) {
    const required = requiredForTarget(subject, subject.targetGrade);
    if (required !== null && required > 100) {
      warnings.push('⚠ Target unreachable — required score exceeds 100%');
    } else if (required !== null && required > 90) {
      warnings.push('⚠ Target challenging — need 90%+ on remaining');
    }
  }
  return warnings;
}

export function getColorForGrade(pct: number): Subject['color'] {
  if (pct >= 80) return 'teal';
  if (pct >= 70) return 'amber';
  if (pct >= 60) return 'ink';
  return 'red';
}

export function totalWeight(components: GradingComponent[]): number {
  return components.reduce((s, c) => s + c.weight, 0);
}
