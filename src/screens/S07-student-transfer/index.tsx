import React, { useState } from 'react';

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
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>תלמידים</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">ייבוא תלמידים מקובץ</span>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900">ייבוא תלמידים מקובץ</h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm">1</div>
            <span className="text-xs mt-1 text-blue-600 font-medium">תבנית</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm">2</div>
            <span className="text-xs mt-1 text-gray-500">העלאה</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm">3</div>
            <span className="text-xs mt-1 text-gray-500">בדיקה</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-medium text-sm">4</div>
            <span className="text-xs mt-1 text-gray-500">אישור</span>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
          <div className="flex flex-col items-center">
            <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-sm font-medium text-gray-700">גרירת קובץ</span>
            <span className="text-xs text-gray-500 mt-1">Excel / CSV</span>
            <span className="text-xs text-blue-600 mt-3 font-medium underline">הורדת תבנית</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 font-semibold text-gray-800">
          בדיקה
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                <th className="py-3 px-4">שורה</th>
                <th className="py-3 px-4">שם</th>
                <th className="py-3 px-4">כיתה</th>
                <th className="py-3 px-4">סטטוס</th>
                <th className="py-3 px-4">שגיאה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {rows.map((item) => (
                <tr key={item.row} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{item.row}</td>
                  <td className="py-3 px-4 flex items-center gap-3">
                    {item.avatar ? (
                      <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                        {item.avatar}
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
                        ?
                      </span>
                    )}
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{item.className}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-px px-2.5 py-1 text-xs font-medium rounded-full ${
                      item.statusType === 'success' ? 'bg-green-100 text-green-700' :
                      item.statusType === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{item.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          ביטול
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          הורד דוח שגיאות
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          ייבא תקינות
        </button>
      </div>
    </div>
  );
}