import { useLocalStorage } from './useLocalStorage';

export type AttendanceStatus = 'present' | 'absent';
export type AttendanceRecord = Record<string, Record<string, AttendanceStatus>>;

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function todayDay(): 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun' {
  const idx = new Date().getDay();
  return (['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][idx]) as 'Mon';
}

export function useAttendance() {
  const [records, setRecords] = useLocalStorage<AttendanceRecord>('axiom-attendance', {});

  const markAttendance = (slotId: string, date: string, status: AttendanceStatus) => {
    setRecords(prev => ({
      ...prev,
      [date]: { ...(prev[date] || {}), [slotId]: status },
    }));
  };

  return { records, setRecords, markAttendance };
}
