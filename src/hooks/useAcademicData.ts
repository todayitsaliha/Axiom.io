import { useLocalStorage } from './useLocalStorage';
import { AcademicData, Subject, GradingComponent, TimeSlot, SubComponent, SUBJECT_COLORS } from '@/types/academic';

const DEFAULT_DATA: AcademicData = {
  studentName: 'Student',
  semester: 'Fall 2024',
  subjects: [],
  timetable: [],
  onboarded: false,
};

export function useAcademicData() {
  const [data, setData] = useLocalStorage<AcademicData>('academic-dashboard', DEFAULT_DATA);

  const addSubject = (subject: Omit<Subject, 'id' | 'color'>) => {
    setData(prev => ({
      ...prev,
      subjects: [...prev.subjects, {
        ...subject,
        id: crypto.randomUUID(),
        color: SUBJECT_COLORS[prev.subjects.length % SUBJECT_COLORS.length],
      }],
    }));
  };

  const removeSubject = (id: string) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== id),
      timetable: prev.timetable.filter(t => t.subjectId !== id),
    }));
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  };

  const updateComponent = (subjectId: string, componentId: string, updates: Partial<GradingComponent>) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === subjectId ? {
        ...s,
        components: s.components.map(c => c.id === componentId ? {
          ...c,
          ...updates,
          status: updates.earnedScore !== undefined && updates.earnedScore !== null ? 'completed' as const : c.status,
        } : c),
      } : s),
    }));
  };

  const addComponent = (subjectId: string, component: Omit<GradingComponent, 'id'>) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === subjectId ? {
        ...s,
        components: [...s.components, {
          ...component,
          id: crypto.randomUUID(),
          subComponents: component.subComponents || [],
          status: component.earnedScore !== null ? 'completed' : 'upcoming',
        }],
      } : s),
    }));
  };

  const removeComponent = (subjectId: string, componentId: string) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === subjectId ? {
        ...s,
        components: s.components.filter(c => c.id !== componentId),
      } : s),
    }));
  };

  const addSubComponent = (subjectId: string, componentId: string, subComp: Omit<SubComponent, 'id'>) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === subjectId ? {
        ...s,
        components: s.components.map(c => c.id === componentId ? {
          ...c,
          subComponents: [...(c.subComponents || []), { ...subComp, id: crypto.randomUUID() }],
        } : c),
      } : s),
    }));
  };

  const updateSubComponent = (subjectId: string, componentId: string, subCompId: string, updates: Partial<SubComponent>) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === subjectId ? {
        ...s,
        components: s.components.map(c => c.id === componentId ? {
          ...c,
          subComponents: (c.subComponents || []).map(sc => sc.id === subCompId ? { ...sc, ...updates } : sc),
        } : c),
      } : s),
    }));
  };

  const removeSubComponent = (subjectId: string, componentId: string, subCompId: string) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === subjectId ? {
        ...s,
        components: s.components.map(c => c.id === componentId ? {
          ...c,
          subComponents: (c.subComponents || []).filter(sc => sc.id !== subCompId),
        } : c),
      } : s),
    }));
  };

  const updateStudentInfo = (name: string, semester: string) => {
    setData(prev => ({ ...prev, studentName: name, semester }));
  };

  const completeOnboarding = (name: string, semester: string, semesterStart?: string, semesterEnd?: string) => {
    setData(prev => ({
      ...prev,
      studentName: name,
      semester,
      semesterStart,
      semesterEnd,
      onboarded: true,
    }));
  };

  const addTimeSlot = (slot: Omit<TimeSlot, 'id'>) => {
    setData(prev => ({
      ...prev,
      timetable: [...prev.timetable, { ...slot, id: crypto.randomUUID() }],
    }));
  };

  const removeTimeSlot = (id: string) => {
    setData(prev => ({
      ...prev,
      timetable: prev.timetable.filter(t => t.id !== id),
    }));
  };

  return {
    data,
    addSubject,
    removeSubject,
    updateSubject,
    updateComponent,
    addComponent,
    removeComponent,
    addSubComponent,
    updateSubComponent,
    removeSubComponent,
    updateStudentInfo,
    completeOnboarding,
    addTimeSlot,
    removeTimeSlot,
  };
}
