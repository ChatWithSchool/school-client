import { Lesson } from './types';

export const DAYS = ["יום א'", "יום ב'", "יום ג'", "יום ד'", "יום ה'", "יום ו'"];

export const HOURS = [
  { id: 1, label: 'שיעור 1', time: '08:00' },
  { id: 2, label: 'שיעור 2', time: '08:50' },
  { id: 3, label: 'שיעור 3', time: '09:40' },
  { id: 4, label: 'שיעור 4', time: '10:50' },
  { id: 5, label: 'שיעור 5', time: '11:40' },
  { id: 6, label: 'שיעור 6', time: '12:30' },
  { id: 7, label: 'שיעור 7', time: '13:20' },
];

export const INITIAL_LESSONS: Lesson[] = [
  { id: '1', subject: 'מתמטיקה', className: '1ח', teacher: 'עמית כהן', room: 'חדר 4', day: "יום א'", hour: 1, color: 'bg-blue-600 text-white' },
  { id: '2', subject: 'עברית', className: '1ח', teacher: 'שרה לוי', room: 'חדר 4', day: "יום א'", hour: 2, color: 'bg-emerald-600 text-white' },
  { id: '3', subject: 'אנגלית', className: '1ח', teacher: 'דן רון', room: 'חדר 2', day: "יום א'", hour: 3, color: 'bg-amber-500 text-white' },
  { id: '4', subject: 'מדעים', className: '1ח', teacher: 'רחל גולן', room: 'חדר מעבדה', day: "יום א'", hour: 5, color: 'bg-indigo-500 text-white' },
  { id: '5', subject: 'היסטוריה', className: '1ח', teacher: 'יוסי כהן', room: 'חדר 4', day: "יום א'", hour: 7, color: 'bg-lime-600 text-white' },
  { id: '6', subject: 'תנ"ך', className: '1ח', teacher: 'דוד אברהם', room: 'חדר 4', day: "יום ב'", hour: 3, color: 'bg-pink-600 text-white' },
];

export const SUBJECT_OPTIONS = [
  { value: 'מתמטיקה', label: 'מתמטיקה' },
  { value: 'עברית', label: 'עברית' },
  { value: 'אנגלית', label: 'אנגלית' },
  { value: 'מדעים', label: 'מדעים' },
  { value: 'היסטוריה', label: 'היסטוריה' },
  { value: 'תנ"ך', label: "תנ\"ך" },
];

export const CLASS_OPTIONS = [
  { value: '1ח', label: 'כיתה 1ח' },
  { value: '2ח', label: 'כיתה 2ח' },
  { value: '1ט', label: 'כיתה 1ט' },
];

export const TEACHER_OPTIONS = [
  { value: 'עמית כהן', label: 'עמית כהן' },
  { value: 'שרה לוי', label: 'שרה לוי' },
  { value: 'דן רון', label: 'דן רון' },
  { value: 'רחל גולן', label: 'רחל גולן' },
  { value: 'יוסי כהן', label: 'יוסי כהן' },
  { value: 'דוד אברהם', label: 'דוד אברהם' },
];

export const ROOM_OPTIONS = [
  { value: 'חדר 4', label: 'חדר 4' },
  { value: 'חדר 2', label: 'חדר 2' },
  { value: 'חדר מעבדה', label: 'חדר מעבדה' },
];