import React, { useState } from 'react';
import { Button, Select, TextField, DatePicker, Alert } from '../../components/ui';

export default function StudentTransferScreen() {
  const [selectedClass, setSelectedClass] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  // נתונים לדוגמה לכיתות היעד
  const classOptions = [
    { label: 'כיתה יא-1', value: '11-1' },
    { label: 'כיתה יא-2', value: '11-2' },
    { label: 'כיתה יב-1', value: '12-1' },
  ];

  const handleTransfer = () => {
    // כאן תתבצע קריאת ה-API בהמשך: POST /students/{id}/transfer
    setSuccessMessage(true);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>העברת תלמיד בין כיתות [S07]</h2>

      {/* פרטי ההעברה */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* כיתה נוכחית - קריאה בלבד */}
        <TextField
          label="כיתה נוכחית"
          value="י' 3 (נוכחי)"
          disabled
        />

        {/* כיתה חדשה */}
        <Select
          label="כיתה חדשה *"
          options={classOptions}
          value={selectedClass}
          onChange={(val: any) => setSelectedClass(val)}
        />

        {/* תאריך תחולה */}
        <DatePicker
          label="תאריך תחולה *"
          value={transferDate}
          onChange={(date: any) => setTransferDate(date)}
        />

        {/* סיבה (אופציונלי) */}
        <TextField
          label="סיבה (אופציונלי)"
          value={reason}
          onChange={(e: any) => setReason(e.target.value)}
        />

        {/* השפעות */}
        <Alert 
          variant="info" 
          title="השפעות העברה"
          message="נוכחות וציונים היסטוריים עד תאריך התחולה יישארו משויכים לכיתה הישנה."
        />

        {successMessage && (
          <Alert 
            variant="success" 
            title="הצלחה"
            message="ההעברה בוצעה בהצלחה ונשמרה בהיסטוריה."
          />
        )}

        {/* פעולות */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <Button variant="primary" onClick={handleTransfer}>
            אשר העברה
          </Button>
          <Button variant="secondary" onClick={() => {}}>
            בטל
          </Button>
        </div>

      </div>
    </div>
  );
}