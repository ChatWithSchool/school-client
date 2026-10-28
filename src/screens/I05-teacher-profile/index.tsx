import React, { useState } from 'react';
import { Button } from '../../components/ui';

export default function Screen() {
  // ניהול הטאבים: 'details' לפרטים אישיים, 'classes' למקצועות וכיתות
  const [activeTab, setActiveTab] = useState<'details' | 'classes'>('details');

  // נתוני דמה עבור הטבלה (מקצועות וכיתות)
  const subjectsData = [
    { id: '1', subject: 'מתמטיקה', className: '1ח', hoursPerWeek: 5 },
    { id: '2', subject: 'מתמטיקה', className: '2ח', hoursPerWeek: 5 },
    { id: '3', subject: 'שעת חינוך', className: '1ח', hoursPerWeek: 2 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" dir="rtl">
      {/* כותרת עליונה של המסך */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>צוות</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">פרופיל מורה</span>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <span>עריכה</span>
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">פרופיל מורה</h1>

      {/* לשוניות מעבר (Tabs) */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            פרטים
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`pb-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === 'classes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            מקצועות וכיתות
          </button>
        </div>
      </div>

      {/* תוכן הטאב: פרטים אישיים */}
      {activeTab === 'details' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">פרטים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">אימייל</label>
              <input
                type="text"
                readOnly
                value="amit.cohen@school.example"
                className="w-full bg-gray-50 border border-gray-200 rounded-md p-2.5 text-sm text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">שם מלא</label>
              <input
                type="text"
                readOnly
                value="עמית כהן"
                className="w-full bg-gray-50 border border-gray-200 rounded-md p-2.5 text-sm text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">טלפון</label>
              <input
                type="text"
                readOnly
                value="050-000-0000"
                className="w-full bg-gray-50 border border-gray-200 rounded-md p-2.5 text-sm text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">תאריך תחילת עבודה</label>
              <input
                type="text"
                readOnly
                value="01.09.2022"
                className="w-full bg-gray-50 border border-gray-200 rounded-md p-2.5 text-sm text-gray-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* תוכן הטאב: מקצועות וכיתות */}
      {activeTab === 'classes' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">מקצועות וכיתות</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm bg-gray-50">
                  <th className="p-3 font-medium">מקצוע</th>
                  <th className="p-3 font-medium">כיתה</th>
                  <th className="p-3 font-medium">שעות בשבוע</th>
                </tr>
              </thead>
              <tbody>
                {subjectsData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm text-gray-800">
                    <td className="p-3">{item.subject}</td>
                    <td className="p-3">{item.className}</td>
                    <td className="p-3">{item.hoursPerWeek}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}