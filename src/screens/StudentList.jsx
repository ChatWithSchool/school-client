import React, { useState } from 'react';

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');

  // נתונים לדוגמה עבור רשימת התלמידים [S01]
  const [students] = useState([
    { id: '1', studentId: '321456789', firstName: 'ישראל', lastName: 'ישראלי', grade: 'ז', classNum: '1', status: 'פעיל' },
    { id: '2', studentId: '987654321', firstName: 'נועה', lastName: 'כהן', grade: 'ז', classNum: '2', status: 'פעיל' },
    { id: '3', studentId: '456789123', firstName: 'דניאל', lastName: 'לוי', grade: 'ח', classNum: '1', status: 'לא פעיל' },
  ]);

  // סינון תלמידים לפי חיפוש וכתה
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`;
    const matchesSearch = fullName.includes(searchTerm) || student.studentId.includes(searchTerm);
    const matchesClass = classFilter === '' || student.grade === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'sans-serif' }}>
      <h2>רשימת תלמידים [S01]</h2>

      {/* סרגל סינון וחיפוש */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="חיפוש לפי שם או תעודת זהות..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px 12px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">כל השכבות</option>
          <option value="ז">שכבה ז'</option>
          <option value="ח">שכבה ח'</option>
          <option value="ט">שכבה ט'</option>
        </select>
      </div>

      {/* טבלת התלמידים */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '12px' }}>תעודת זהות</th>
            <th style={{ padding: '12px' }}>שם פרטי</th>
            <th style={{ padding: '12px' }}>שם משפחה</th>
            <th style={{ padding: '12px' }}>כיתה</th>
            <th style={{ padding: '12px' }}>סטאטוס</th>
            <th style={{ padding: '12px' }}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{student.studentId}</td>
              <td style={{ padding: '12px' }}>{student.firstName}</td>
              <td style={{ padding: '12px' }}>{student.lastName}</td>
              <td style={{ padding: '12px' }}>{`${student.grade}'${student.classNum}`}</td>
              <td style={{ padding: '12px' }}>{student.status}</td>
              <td style={{ padding: '12px' }}>
                <button style={{ padding: '4px 8px', cursor: 'pointer' }}>צפייה/עריכה</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;