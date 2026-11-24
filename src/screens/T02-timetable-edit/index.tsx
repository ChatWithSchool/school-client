import { useState } from 'react';
import { Button, Select } from '../../components/ui';
import {
  DAYS,
  HOURS,
  INITIAL_LESSONS,
  SUBJECT_OPTIONS,
  CLASS_OPTIONS,
  TEACHER_OPTIONS,
  ROOM_OPTIONS,
} from '../../mocks/timetableData'
import { Lesson } from './types';

type FormErrorKind = 'validation' | 'room' | 'teacher' | 'class';

interface FormError {
  kind: FormErrorKind;
  message: string;
}

const ERROR_TITLES: Record<FormErrorKind, string> = {
  validation: 'שגיאה בטופס',
  room: 'התנגשות חדר',
  teacher: 'התנגשות מורה',
  class: 'התנגשות כיתה',
};

const DAY_OPTIONS = DAYS.map((d) => ({ value: d, label: d }));
const HOUR_OPTIONS = HOURS.map((h) => ({ value: String(h.id), label: h.label }));

interface TimetableEditScreenProps {
  canEdit?: boolean;
  isLoading?: boolean;
  loadError?: string | null;
}

export default function TimetableEditScreen({
  canEdit = true,
  isLoading = false,
  loadError = null,
}: TimetableEditScreenProps) {
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);

  // טופס שיעור
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');

  const [formError, setFormError] = useState<FormError | null>(null);

  const getLessonAt = (d: string, h: number) =>
    lessons.find((l) => l.day.trim() === d.trim() && Number(l.hour) === h);

  const handleSaveLesson = () => {
    setFormError(null);

    if (!subject || !className || !teacher || !room || !day || !hour) {
      setFormError({ kind: 'validation', message: 'נא למלא את כל שדות החובה (*)' });
      return;
    }

    const targetHour = Number(hour);
    const sameSlot = lessons.filter(
      (l) => l.day.trim() === day.trim() && Number(l.hour) === targetHour
    );

    const roomConflict = sameSlot.find((l) => l.room === room);
    if (roomConflict) {
      setFormError({
        kind: 'room',
        message: `החדר ${room} כבר תפוס ב${day} בשיעור ${targetHour} על ידי ${roomConflict.subject} (${roomConflict.className})`,
      });
      return;
    }

    const teacherConflict = sameSlot.find((l) => l.teacher === teacher);
    if (teacherConflict) {
      setFormError({
        kind: 'teacher',
        message: `המורה ${teacher} כבר מלמד/ת ב${day} בשיעור ${targetHour} בכיתה ${teacherConflict.className}`,
      });
      return;
    }

    const classConflict = sameSlot.find((l) => l.className === className);
    if (classConflict) {
      setFormError({
        kind: 'class',
        message: `כיתה ${className} כבר לומדת ${classConflict.subject} ב${day} בשיעור ${targetHour}`,
      });
      return;
    }

    const newLesson: Lesson = {
      id: Date.now().toString(),
      subject,
      className,
      teacher,
      room,
      day,
      hour: targetHour,
      color: 'bg-primary-600 text-white font-bold',
    };

    setLessons((prev) => [...prev, newLesson]);

    // איפוס טופס
    setSubject('');
    setClassName('');
    setTeacher('');
    setRoom('');
    setDay('');
    setHour('');
  };

  // ===== מצבי מסך =====
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-fg-secondary" dir="rtl" role="status">
        טוען מערכת שעות...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 max-w-7xl mx-auto" dir="rtl">
        <div role="alert" className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
          {loadError}
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="p-6 max-w-7xl mx-auto" dir="rtl">
        <div role="alert" className="bg-subtle border border-line text-fg p-4 rounded-xl">
          אין לך הרשאה לערוך את מערכת השעות.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-fg-secondary">
          <span>מערכת שעות</span>
          <span>/</span>
          <span className="text-fg font-medium">עריכת מערכת שעות</span>
        </div>
        {/* כפתור הפרסום עדיין לא מחובר לפעולה, לכן הוא מושבת */}
        <Button type="button" variant="primary" disabled>
          פרסום
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-fg">עריכת מערכת שעות</h1>

      {lessons.length === 0 && (
        <p className="text-sm text-fg-secondary">
          עדיין לא נוספו שיעורים. לחצו על משבצת בטבלה כדי להתחיל.
        </p>
      )}

      {/* רשת מערכת השעות */}
      <div className="bg-surface p-4 rounded-xl border border-line shadow-sm overflow-x-auto">
        <div className="min-w-max">
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-semibold text-fg-secondary bg-subtle p-2 rounded-lg">
            <div className="text-start ps-2">שעה</div>
            {DAYS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="space-y-2">
            {HOURS.map((hourObj) => (
              <div
                key={hourObj.id}
                className="grid grid-cols-7 gap-2 items-center text-xs h-14"
              >
                <div className="text-start ps-2 text-fg-muted font-medium">
                  <div className="font-semibold text-fg">{hourObj.label}</div>
                  <div className="text-xs">{hourObj.time}</div>
                </div>

                {DAYS.map((d) => {
                  const lesson = getLessonAt(d, hourObj.id);
                  const cellLabel = lesson
                    ? `${d}, ${hourObj.label}: ${lesson.subject}, חדר ${lesson.room}`
                    : `${d}, ${hourObj.label}: משבצת פנויה, לחצו לבחירה`;
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-label={cellLabel}
                      onClick={() => {
                        setDay(d);
                        setHour(String(hourObj.id));
                      }}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col justify-center items-center h-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                        lesson
                          ? 'bg-primary-600 text-white font-bold border-transparent shadow-md'
                          : 'bg-surface border-dashed border-line hover:border-primary-400 hover:bg-subtle/30'
                      }`}
                    >
                      {lesson ? (
                        <>
                          <span className="font-bold text-xs text-white">{lesson.subject}</span>
                          <span className="opacity-90 text-white text-xs">{lesson.room}</span>
                        </>
                      ) : (
                        <span aria-hidden="true" className="text-fg-muted text-base">
                          +
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* חלון שיעור */}
      <div className="bg-surface p-6 rounded-xl border border-line shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-fg">חלון שיעור</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            id="lesson-subject"
            label="מקצוע"
            required
            placeholder="בחירה"
            options={SUBJECT_OPTIONS}
            value={subject}
            onValueChange={setSubject}
          />

          <Select
            id="lesson-class"
            label="כיתה / קבוצה"
            required
            placeholder="בחירה"
            options={CLASS_OPTIONS}
            value={className}
            onValueChange={setClassName}
          />

          <Select
            id="lesson-room"
            label="חדר"
            required
            placeholder="בחירה"
            options={ROOM_OPTIONS}
            value={room}
            onValueChange={setRoom}
          />

          <Select
            id="lesson-teacher"
            label="מורה"
            required
            placeholder="בחירה"
            options={TEACHER_OPTIONS}
            value={teacher}
            onValueChange={setTeacher}
          />

          <Select
            id="lesson-day"
            label="יום"
            required
            placeholder="בחירה"
            options={DAY_OPTIONS}
            value={day}
            onValueChange={setDay}
          />

          <Select
            id="lesson-hour"
            label="שעה"
            required
            placeholder="בחירה"
            options={HOUR_OPTIONS}
            value={hour}
            onValueChange={setHour}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="button" variant="primary" onClick={handleSaveLesson}>
            שמירת שיעור
          </Button>
        </div>
      </div>

      {formError && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
          <div className="font-semibold mb-1">{ERROR_TITLES[formError.kind]}</div>
          <div>{formError.message}</div>
        </div>
      )}
    </div>
  );

}
