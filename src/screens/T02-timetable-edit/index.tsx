import { useState } from 'react';
import { Button } from '../../components/ui';
import {
  DAYS,
  HOURS,
  INITIAL_LESSONS,
  SUBJECT_OPTIONS,
  CLASS_OPTIONS,
  TEACHER_OPTIONS,
  ROOM_OPTIONS,
} from './mockData';
import { Lesson, ConflictError } from './types';

export default function TimetableEditScreen() {
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);

  // טופס שיעור
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');
  const [dayHourInput, setDayHourInput] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  // ניהול התנגשות
  const [conflict, setConflict] = useState<ConflictError>({
    hasConflict: false,
    message: '',
  });

  const getLessonAt = (day: string, hour: number) => {
    return lessons.find((l) => l.day.trim() === day.trim() && Number(l.hour) === Number(hour));
  };

  const handleSaveLesson = () => {
    setConflict({ hasConflict: false, message: '' });

    if (!subject || !className || !teacher || !room || !dayHourInput) {
      setConflict({
        hasConflict: true,
        message: 'נא למלא את כל שדות החובה (*)',
      });
      return;
    }

    const parts = dayHourInput.trim().split(' ');
    const targetHour = parseInt(parts[parts.length - 1], 10);
    const targetDay = parts.slice(0, -1).join(' ');

    if (!targetDay || isNaN(targetHour) || targetHour < 1 || targetHour > 7) {
      setConflict({
        hasConflict: true,
        message: 'פורמט יום ושעה אינו תקין. דוגמה תקינה: "יום א\' 1"',
      });
      return;
    }

    // בדיקת התנגשות חדר
    const roomConflict = lessons.find(
      (l) => l.day.trim() === targetDay.trim() && Number(l.hour) === targetHour && l.room === room
    );
    if (roomConflict) {
      setConflict({
        hasConflict: true,
        message: `התנגשות חדר: ${room} כבר תפוס ב${targetDay} בשיעור ${targetHour} על ידי ${roomConflict.subject} (${roomConflict.className})`,
      });
      return;
    }

    // בדיקת התנגשות מורה
    const teacherConflict = lessons.find(
      (l) => l.day.trim() === targetDay.trim() && Number(l.hour) === targetHour && l.teacher === teacher
    );
    if (teacherConflict) {
      setConflict({
        hasConflict: true,
        message: `התנגשות מורה: המורה ${teacher} כבר מלמד/ת ב${targetDay} בשיעור ${targetHour} בכיתה ${teacherConflict.className}`,
      });
      return;
    }

    // בדיקת התנגשות כיתה
    const classConflict = lessons.find(
      (l) => l.day.trim() === targetDay.trim() && Number(l.hour) === targetHour && l.className === className
    );
    if (classConflict) {
      setConflict({
        hasConflict: true,
        message: `התנגשות כיתה: כיתה ${className} כבר לומדת ${classConflict.subject} ב${targetDay} בשיעור ${targetHour}`,
      });
      return;
    }

    const newLesson: Lesson = {
      id: Date.now().toString(),
      subject,
      className,
      teacher,
      room,
      day: targetDay,
      hour: targetHour,
      color: 'bg-blue-600 text-white font-bold',
    };

    // שימוש ב-Callback לעדכון הסטייט בצורה בטוחה
    setLessons((prev) => [...prev, newLesson]);

    // איפוס טופס
    setSubject('');
    setClassName('');
    setTeacher('');
    setRoom('');
    setDayHourInput('');
    setIsRecurring(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>מערכת שעות</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">עריכת מערכת שעות</span>
        </div>
        <Button type="button" variant="primary" className="flex items-center gap-2">
          <span>פרסום</span>
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">עריכת מערכת שעות</h1>

      {/* רשת מערכת השעות */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <div style={{ minWidth: '800px' }}>
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-semibold text-gray-700 bg-gray-50 p-2 rounded-lg">
            <div className="text-start ps-2">שעה</div>
            {DAYS.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="space-y-2">
            {HOURS.map((hourObj) => (
              <div 
                key={hourObj.id} 
                className="grid grid-cols-7 gap-2 items-center text-xs"
                style={{ minHeight: '52px' }}
              >
                <div className="text-start ps-2 text-gray-500 font-medium">
                  <div className="font-semibold text-gray-800">{hourObj.label}</div>
                  <div style={{ fontSize: '11px' }}>{hourObj.time}</div>
                </div>

                {DAYS.map((day) => {
                  const lesson = getLessonAt(day, hourObj.id);
                  return (
                    <div
                      key={day}
                      onClick={() => setDayHourInput(`${day} ${hourObj.id}`)}
                      style={{ minHeight: '48px' }}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col justify-center items-center ${
                        lesson
                          ? 'bg-blue-600 text-white font-bold border-transparent shadow-md'
                          : 'bg-gray-50 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      {lesson ? (
                        <>
                          <div className="font-bold text-xs text-white">{lesson.subject}</div>
                          <div className="opacity-90 text-white" style={{ fontSize: '10px' }}>{lesson.room}</div>
                        </>
                      ) : (
                        <span className="text-gray-300 hover:text-blue-500 text-base">+</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* חלון שיעור */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">חלון שיעור</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">מקצוע *</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
            >
              <option value="">בחירה</option>
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">כיתה / קבוצה *</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
            >
              <option value="">בחירה</option>
              {CLASS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">חדר</label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
            >
              <option value="">בחירה</option>
              {ROOM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">מורה *</label>
            <select
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
            >
              <option value="">בחירה</option>
              {TEACHER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">יום ושעה *</label>
            <input
              type="text"
              placeholder="הקלידו כאן (לדוגמה: יום א' 1)"
              value={dayHourInput}
              onChange={(e) => setDayHourInput(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="recurring" className="text-sm text-gray-700 cursor-pointer">
              חזרתיות
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="button" variant="primary" onClick={handleSaveLesson}>
            שמירת שיעור
          </Button>
        </div>
      </div>

      {conflict.hasConflict && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
          <div className="font-semibold mb-1">התראת התנגשות!</div>
          <div>{conflict.message}</div>
        </div>
      )}
    </div>
  );
}
