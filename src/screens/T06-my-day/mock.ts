// T06 · My day (teacher) – mock data for sprint 1 (client only).
// Shape follows GET /me/today. In sprint 4 this file is replaced by the real API.

export type SubjectTone = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6';

export interface TodayLesson {
  id: string;
  period: number; // lesson number in the day
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  classId: string;
  className: string;
  subject: string;
  tone: SubjectTone; // subject colour (LessonBlock)
  room: string;
  substitute?: { teacherName: string }; // a substitute teacher is assigned today
}

export interface TodayResponse {
  date: string; // 'YYYY-MM-DD'
  isHoliday: boolean;
  holidayName?: string;
  lessons: TodayLesson[];
}

const today = new Date().toISOString().slice(0, 10);

export const mockToday: TodayResponse = {
  date: today,
  isHoliday: false,
  lessons: [
    { id: 'l1', period: 1, startTime: '08:00', endTime: '08:45', classId: 'c-1g', className: '1ג', subject: 'מתמטיקה', tone: 'c1', room: '4' },
    { id: 'l2', period: 2, startTime: '08:50', endTime: '09:35', classId: 'c-1g', className: '1ג', subject: 'מתמטיקה', tone: 'c1', room: '4' },
    { id: 'l3', period: 3, startTime: '09:40', endTime: '10:25', classId: 'c-2g', className: '2ג', subject: 'עברית', tone: 'c2', room: '3' },
    { id: 'l4', period: 4, startTime: '10:50', endTime: '11:35', classId: 'c-3g', className: '3ג', subject: 'מתמטיקה', tone: 'c1', room: '7' },
  ],
};

export const mockHoliday: TodayResponse = { date: today, isHoliday: true, holidayName: 'חופשת חנוכה', lessons: [] };
export const mockEmpty: TodayResponse = { date: today, isHoliday: false, lessons: [] };