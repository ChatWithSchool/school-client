import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Tabs, TextField, Table } from '../../components/ui';

export default function TeacherProfileScreen() {
  const { id } = useParams();

  // מצב עריכה
  const [isEditing, setIsEditing] = useState(false);

  // נתוני מורה
  const [teacherData, setTeacherData] = useState({
    fullName: 'עמית כהן',
    email: 'amit.cohen@school.example',
    phone: '050-000-0000',
    startDate: '01.09.2022',
  });

  const subjectsData = [
    { id: '1', subject: 'מתמטיקה', className: '1ח', hoursPerWeek: 5 },
    { id: '2', subject: 'מתמטיקה', className: '2ח', hoursPerWeek: 5 },
    { id: '3', subject: 'שעת חינוך', className: '1ח', hoursPerWeek: 2 },
  ];

  const handleInputChange = (field: string, value: string) => {
    setTeacherData((prev) => ({ ...prev, [field]: value }));
  };

  const tabItems = [
    {
      value: 'details',
      label: 'פרטים',
      content: (
        <div className="bg-white p-6 rounded-lg border border-line shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-fg">פרטים אישיים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="שם מלא"
              readOnly={!isEditing}
              value={teacherData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
            <TextField
              label="אימייל"
              readOnly={!isEditing}
              value={teacherData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <TextField
              label="טלפון"
              readOnly={!isEditing}
              value={teacherData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <TextField
              label="תאריך תחילת עבודה"
              readOnly={!isEditing}
              value={teacherData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      value: 'classes',
      label: 'מקצועות וכיתות',
      content: (
        <div className="bg-white p-6 rounded-lg border border-line shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-fg">מקצועות וכיתות</h2>
          <Table
            caption="טבלת מקצועות וכיתות של המורה"
            rows={subjectsData}
            getRowId={(row) => row.id}
            columns={[
              { key: 'subject', header: 'מקצוע', cell: (row) => row.subject },
              { key: 'className', header: 'כיתה', cell: (row) => row.className },
              { key: 'hoursPerWeek', header: 'שעות בשבוע', numeric: true, cell: (row) => row.hoursPerWeek },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-fg-secondary">
          <span>צוות</span>
          <span>/</span>
          <span className="text-fg font-medium">פרופיל מורה (I05)</span>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'שמירה' : 'עריכה'}
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-fg">
        פרופיל מורה {id ? `(מזהה: ${id})` : ''}
      </h1>

      <Tabs items={tabItems} label="ניהול פרופיל מורה" />
    </div>
  );
}