import React, { useState } from 'react';
// טיפוס לדוגמה לנתוני התלמיד (אפשר בהמשך להעביר לקובץ types נפרד)
interface Student {
  id: string;
  name: string;
  className: string;
  parentName: string;
  parentPhone: string;
  attendance: string;
  tags: string[];
  status: 'נוכח' | 'איחור' | 'נעדר';
}

// נתוני דמה (Mock Data) לבדיקה מקומית בספרינט 1
const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'נועם ביטון',
    className: '1ת',
    parentName: 'עמית ביטון',
    parentPhone: '050-000-0000',
    attendance: '98%',
    tags: ['חדש'],
    status: 'נוכח',
  },
  {
    id: '2',
    name: 'יובל קליין',
    className: '1ת',
    parentName: 'שי קליין',
    parentPhone: '050-000-0001',
    attendance: '94%',
    tags: [],
    status: 'נוכח',
  },
  {
    id: '3',
    name: 'עדי פרץ',
    className: '2ת',
    parentName: 'יובל פרץ',
    parentPhone: '050-000-0002',
    attendance: '71%',
    tags: ['מעקב'],
    status: 'איחור',
  },
];

export default function StudentListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('הכל');
  const [selectedStatus, setSelectedStatus] = useState('הכל');

  // סינון בסיסי לפי חיפוש וכיתה
  const filteredStudents = MOCK_STUDENTS.filter((student) => {
    const matchesSearch = student.name.includes(searchQuery) || student.id.includes(searchQuery);
    const matchesClass = selectedClass === 'הכל' || student.className === selectedClass;
    const matchesStatus = selectedStatus === 'הכל' || student.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      {/* כותרת העמוד וכפתורים */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">תלמידים</h1>
          <p className="text-sm text-gray-500 mt-1">412 תלמידים בשנת הלימודים הנוכחית</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + תלמיד חדש
          </button>
          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            ייבוא מקובץ
          </button>
        </div>
      </div>

      {/* סרגל חיפוש וסינון */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="חיפוש שם או תעודת זהות..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="הכל">כיתה: הכל</option>
            <option value="1ת">1ת</option>
            <option value="2ת">2ת</option>
          </select>
        </div>
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="הכל">סטטוס: הכל</option>
            <option value="נוכח">נוכח</option>
            <option value="איחור">איחור</option>
            <option value="נעדר">נעדר</option>
          </select>
        </div>
      </div>

      {/* טבלת תלמידים */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-sm font-semibold text-gray-700">
              <th className="p-3">תלמיד</th>
              <th className="p-3">כיתה</th>
              <th className="p-3">הורה ראשי</th>
              <th className="p-3">נוכחות החודש</th>
              <th className="p-3">תגיות</th>
              <th className="p-3">סטטוס</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-gray-900 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      {student.name.charAt(0)}
                    </span>
                    {student.name}
                  </td>
                  <td className="p-3 text-gray-600">{student.className}</td>
                  <td className="p-3 text-gray-600">
                    <div>{student.parentName}</div>
                    <div className="text-xs text-gray-400">{student.parentPhone}</div>
                  </td>
                  <td className="p-3 text-gray-600 font-medium">{student.attendance}</td>
                  <td className="p-3">
                    {student.tags.map((tag, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'נוכח'
                          ? 'bg-green-100 text-green-800'
                          : student.status === 'איחור'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  לא נמצאו תלמידים מתאימים
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* תחתית - עימוד */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>מציג תוצאות עבור רשימת התלמידים</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-gray-300 rounded bg-white font-semibold text-blue-600">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50">3</button>
        </div>
      </div>
    </div>
  );
}



