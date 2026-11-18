import { useState } from 'react';

export default function Screen() {
  const [rows] = useState([
    { row: 1, name: 'אופק גולדשטיין', avatar: 'א', className: '1ח', status: 'תקין', error: '—', statusType: 'success' },
    { row: 2, name: 'ים דהן', avatar: 'י', className: '2ת', status: 'תקין', error: '—', statusType: 'success' },
    { row: 3, name: 'שי סבן', avatar: 'ש', className: '1י', status: 'שגיאה', error: 'כיתה לא קיימת', statusType: 'error' },
    { row: 4, name: 'טל מזרחי', avatar: 'ט', className: '1ח', status: 'עדכון', error: 'ת.ז. קיימת, הפרטים יעודכנו', statusType: 'warning' },
    { row: 5, name: 'אור', avatar: '', className: '3נ', status: 'שגיאה', error: 'שם משפחה חסר', statusType: 'error' },
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* כותרת ראשית */}
      <div className="flex items-center gap-2 text-body text-fg-muted">
        <span>תלמידים</span>
        <span>/</span>
        <span className="text-fg font-medium">ייבוא תלמידים מקובץ</span>
      </div>
      
      <h1 className="text-h1 text-fg">ייבוא תלמידים מקובץ</h1>

      {/* שלבי התהליך (Steppers) */}
      <div className="bg-surface p-6 rounded-lg border border-line">
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium text-sm">1</div>
            <span className="text-caption mt-1 text-primary-600 font-medium">תבנית</span>
          </div>
          <div className="flex-1 h-0.5 bg-line mx-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-subtle text-fg-secondary flex items-center justify-center font-medium text-sm">2</div>
            <span className="text-caption mt-1 text-fg-muted">העלאה</span>
          </div>
          <div className="flex-1 h-0.5 bg-line mx-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-subtle text-fg-secondary flex items-center justify-center font-medium text-sm">3</div>
            <span className="text-caption mt-1 text-fg-muted">בדיקה</span>
          </div>
          <div className="flex-1 h-0.5 bg-line mx-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-subtle text-fg-secondary flex items-center justify-center font-medium text-sm">4</div>
            <span className="text-caption mt-1 text-fg-muted">אישור</span>
          </div>
        </div>

        {/* אזור הורדת תבנית */}
        <div className="border-2 border-dashed border-line rounded-lg p-8 text-center bg-page hover:bg-subtle transition cursor-pointer">
          <div className="flex flex-col items-center">
            <svg className="w-10 h-10 text-fg-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-body-strong text-fg-secondary">גרירת קובץ</span>
            <span className="text-caption text-fg-muted mt-1">Excel / CSV</span>
            <span className="text-caption text-primary-600 mt-3 font-medium underline">הורדת תבנית</span>
          </div>
        </div>
      </div>

      {/* טבלת בדיקה */}
      <div className="bg-surface rounded-lg border border-line overflow-hidden">
        <div className="p-4 border-b border-line font-semibold text-fg">
          בדיקה
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="bg-page border-b border-line text-caption text-fg-muted uppercase">
                <th className="py-3 px-4">שורה</th>
                <th className="py-3 px-4">שם</th>
                <th className="py-3 px-4">כיתה</th>
                <th className="py-3 px-4">סטטוס</th>
                <th className="py-3 px-4">שגיאה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {rows.map((item) => (
                <tr key={item.row} className="hover:bg-page">
                  <td className="py-3 px-4 text-fg-secondary">{item.row}</td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    {item.avatar ? (
                      <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-caption font-semibold">
                        {item.avatar}
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-subtle text-fg-secondary flex items-center justify-center text-caption">
                        ?
                      </span>
                    )}
                    <span className="font-medium text-fg">{item.name}</span>
                  </td>
                  <td className="py-3 px-4 text-fg-secondary">{item.className}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-1 text-caption font-medium rounded-full ${
                      item.statusType === 'success' ? 'bg-success-50 text-success-700' :
                      item.statusType === 'error' ? 'bg-danger-50 text-danger-700' :
                      item.statusType === 'warning' ? 'bg-warning-50 text-warning-700' : 'bg-info-50 text-info-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-fg-muted">{item.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* כפתורי פעולה בתחתית */}
      <div className="flex items-center justify-end gap-3">
        <button className="px-4 py-2 border border-line rounded-lg text-body font-medium text-fg-secondary hover:bg-page">
          ביטול
        </button>
        <button className="px-4 py-2 border border-line rounded-lg text-body font-medium text-fg-secondary hover:bg-page">
          הורד דוח שגיאות
        </button>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-body font-medium hover:bg-primary-700">
          ייבא תקינות
        </button>
      </div>
    </div>
  );
}