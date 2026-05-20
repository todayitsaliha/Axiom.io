export interface SubComponent {
  id: string;
  name: string;
  maxScore: number;
  earnedScore: number | null;
}

export interface TimeSlot {
  id: string;
  subjectId: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  startTime: string;
  endTime: string;
  room?: string;
}

export interface GradingComponent {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
  earnedScore: number | null;
  dueDate?: string;
  status?: 'upcoming' | 'completed';
  subComponents: SubComponent[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  creditHours: number;
  color: 'teal' | 'amber' | 'red' | 'ink';
  components: GradingComponent[];
  targetGrade?: number;
}

export interface AcademicData {
  subjects: Subject[];
  studentName: string;
  semester: string;
  semesterStart?: string;
  semesterEnd?: string;
  timetable: TimeSlot[];
  onboarded?: boolean;
}

export const GRADE_SCALE: { letter: string; minPct: number; gpa: number }[] = [
  { letter: 'A+', minPct: 93, gpa: 4.0 },
  { letter: 'A',  minPct: 90, gpa: 4.0 },
  { letter: 'A-', minPct: 87, gpa: 3.7 },
  { letter: 'B+', minPct: 83, gpa: 3.3 },
  { letter: 'B',  minPct: 80, gpa: 3.0 },
  { letter: 'B-', minPct: 77, gpa: 2.7 },
  { letter: 'C+', minPct: 73, gpa: 2.3 },
  { letter: 'C',  minPct: 70, gpa: 2.0 },
  { letter: 'C-', minPct: 67, gpa: 1.7 },
  { letter: 'D+', minPct: 63, gpa: 1.3 },
  { letter: 'D',  minPct: 60, gpa: 1.0 },
  { letter: 'F',  minPct: 0,  gpa: 0.0 },
];

export const SUBJECT_COLORS: Subject['color'][] = ['teal', 'amber', 'red', 'ink'];

export const DAYS: TimeSlot['day'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
