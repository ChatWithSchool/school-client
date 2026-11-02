import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function G07Transcripts(): React.ReactElement {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('הכול');
  const [selectedClass, setSelectedClass] = useState<string>('הכול');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h1 text-fg">הפקת תעודות</h1>

      <div className="flex gap-4">
        <div className="flex w-52 flex-col gap-1">
          <label className="text-label text-fg-secondary">מחצית</label>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPeriod(e.target.value)}
              className="w-full appearance-none rounded-xl border border-line bg-surface px-3 py-2.5 ps-8 text-body text-fg focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="הכול">הכול</option>
              <option value="מחצית א">מחצית א'</option>
              <option value="מחצית ב">מחצית ב'</option>
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-3.5 h-4 w-4 text-fg-secondary" />
          </div>
        </div>

        <div className="flex w-52 flex-col gap-1">
          <label className="text-label text-fg-secondary">כיתה או תלמיד</label>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedClass(e.target.value)}
              className="w-full appearance-none rounded-xl border border-line bg-surface px-3 py-2.5 ps-8 text-body text-fg focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="הכול">הכול</option>
              <option value="ז1">ז'1</option>
              <option value="ז2">ז'2</option>
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-3.5 h-4 w-4 text-fg-secondary" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-body-strong text-fg">תצוגה מקדימה</h2>
        </div>

        <div className="mx-auto flex w-full flex-col gap-4 rounded-xl border border-line bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <span className="text-label text-fg-secondary">כותרת מוסד</span>
            <div className="h-2.5 w-full rounded-full bg-subtle" />
            <div className="h-2.5 w-4/5 rounded-full bg-subtle" />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <span className="text-label text-fg-secondary">פרטי תלמיד</span>
            <div className="h-2.5 w-full rounded-full bg-subtle" />
            <div className="h-2.5 w-full rounded-full bg-subtle" />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <span className="text-label text-fg-secondary">טבלת מקצועות וציונים</span>
            <div className="h-2.5 w-full rounded-full bg-subtle" />
            <div className="h-2.5 w-3/4 rounded-full bg-subtle" />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <span className="text-label text-fg-secondary">הערת מחנך</span>
            <div className="h-2.5 w-full rounded-full bg-subtle" />
            <div className="h-2.5 w-full rounded-full bg-subtle" />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <span className="text-label text-fg-secondary">חתימות</span>
            <div className="h-2.5 w-full rounded-full bg-subtle" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-primary-100 bg-primary-50 p-4 text-label text-primary-700">
        <div className="font-bold">ציונים חסרים</div>
        <div>משקלים שלא מסתכמים</div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-primary-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-primary-600 bg-primary-600 px-4 py-2 text-body-strong text-white transition hover:bg-primary-700">
            הפק PDF לתלמיד
          </button>
          <button className="rounded-lg border border-line bg-surface px-4 py-2 text-body-strong text-fg transition hover:bg-subtle">
            הפק לכל הכיתה (קובץ מאוחד)
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-primary-100 px-3 py-2 text-label text-primary-700">
          <span>ציונים</span>
          <span className="font-bold">לא סגורים</span>
        </div>
      </div>
    </div>
  );
}
