import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Alert } from '../../components/ui';

export default function JoinInviteScreen() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.password || !formData.confirmPassword) {
      setError('נא למלא את כל שדות החובה.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות אינן תואמות.');
      return;
    }

    if (formData.password.length < 6) {
      setError('הסיסמה חלשה מדי. אנא בחרו סיסמה באורך 6 תווים לפחות.');
      return;
    }

    // TODO: POST /invites/${token}/accept
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 text-right" dir="rtl">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md border border-gray-100">
        
        {/* תגית עליונה וכותרת */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">הצטרפות בהזמנה (הגדרת חשבון)</h1>
          <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
            <span>ניהול פדגוגי</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
        </div>

        {/* תיבת פרטי ההזמנה (לקריאה בלבד) */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-900 flex flex-col gap-1 text-center font-medium">
          <p>שם המוסד</p>
          <p>התפקיד שהוקצה</p>
          <p>אימייל (לקריאה בלבד)</p>
        </div>

        {/* הצגת שגיאות ולידציה */}
        {error && (
          <div className="mb-4">
            <Alert tone="danger">{error}</Alert>
          </div>
        )}

        {/* טופס הגדרת חשבון */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField 
            label="שם פרטי *" 
            name="firstName"
            placeholder="הקלידו כאן" 
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField 
            label="שם משפחה *" 
            name="lastName"
            placeholder="הקלידו כאן" 
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <TextField 
            label="טלפון" 
            name="phone"
            placeholder="הקלידו כאן" 
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField 
            label="סיסמה עם מד חוזק *" 
            name="password"
            type="password"
            placeholder="הקלידו כאן" 
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField 
            label="אימות סיסמה *" 
            name="confirmPassword"
            type="password"
            placeholder="הקלידו כאן" 
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* אזור הפעולות */}
          <div className="mt-6 flex flex-col gap-3">
            <Button type="submit" variant="primary" className="w-full">
              יצירת חשבון
            </Button>
            <Button type="button" variant="secondary" className="w-full">
              יש לי כבר חשבון
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
