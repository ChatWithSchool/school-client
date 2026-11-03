import { useState } from 'react';
import { Button, Select, TextField, DatePicker, Alert } from '../../components/ui';

export default function StudentTransferScreen() {
  const [selectedClass, setSelectedClass] = useState('');
  // תיקון: הגדרת התאריך כ-Date או null כדי שיתאים ל-DatePicker
  const [transferDate, setTransferDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const classOptions = [
    { label: 'כיתה יא-1', value: '11-1' },
    { label: 'כיתה יא-2', value: '11-2' },
    { label: 'כיתה יב-1', value: '12-1' },
  ];

  const handleTransfer = () => {
    setSuccessMessage(true);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px' }}>העברת תלמיד בין כיתות [S07]</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <TextField
          label="כיתה נוכחית"
          value="י' 3 (נוכחי)"
          disabled
        />

        <Select
          label="כיתה חדשה *"
          options={classOptions}
          value={selectedClass}
          // תיקון: התאמת פונקציית השינוי לפי המבנה של ה-Select
          onValueChange={(val: string) => setSelectedClass(val)}
        />

        <DatePicker
          label="תאריך תחולה *"
          value={transferDate}
          onChange={(date: Date | null) => setTransferDate(date)}
        />

        <TextField
          label="סיבה (אופציונלי)"
          value={reason}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
        />

        {/* תיקון: הסרת ה-variant והעברת הנתונים בצורה תקינה לרכיב Alert */}
        <Alert 
          title="השפעות העברה"
          message="נוכחות וציונים היסטוריים עד תאריך התחולה יישארו משויכים לכיתה הישנה."
        />

        {successMessage && (
          <Alert 
            title="הצלחה"
            message="ההעברה בוצעה בהצלחה ונשמרה בהיסטוריה."
          />
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <Button onClick={handleTransfer}>
            אשר העברה
          </Button>
          <Button onClick={() => {}}>
            בטל
          </Button>
        </div>

      </div>
    </div>
  );
}