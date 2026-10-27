import { useState } from 'react';
import { Button, Modal, PageHeader } from '../../components/ui';

export default function Screen() {
  const [activeTab, setActiveTab] = useState<'classes' | 'groups'>('classes');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [frameName, setFrameName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // נתוני דמה (Mock) לכיתות אם
  const [classesData, setClassesData] = useState([
    { id: '1', name: 'י"א 1', studentsCount: 28, homeroom: 'הרב אברהם כהן' },
    { id: '2', name: 'י"א 2', studentsCount: 30, homeroom: 'הרב משה לוי' },
  ]);

  // נתוני דמה (Mock) לקבוצות לימוד
  const [groupsData, setGroupsData] = useState([
    { id: 'g1', name: "הקבצה א' מתמטיקה", classRef: 'י"א 1', studentsCount: 15 },
    { id: 'g2', name: 'חוג גמרא עיון', classRef: 'חוצת-כיתה', studentsCount: 12 },
  ]);

  const handleCreateNew = async () => {
    if (!frameName.trim()) return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (activeTab === 'classes') {
        setClassesData((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            name: frameName,
            studentsCount: 0,
            homeroom: 'טרם הוגדר',
          },
        ]);
      } else {
        setGroupsData((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            name: frameName,
            classRef: 'חוצת-כיתה',
            studentsCount: 0,
          },
        ]);
      }
      setIsModalOpen(false);
      setFrameName('');
    } catch (err) {
      console.error('Failed to create', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* כותרת המסך והפעולות (השתמשנו ב-subtitle במקום description) */}
      <PageHeader
        title="כיתות וקבוצות לימוד"
        subtitle="רשימה, יצירה ושיוך תלמידים לכיתות ולקבוצות"
        actions={
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            {activeTab === 'classes' ? 'יצירת כיתה חדשה' : 'יצירת קבוצה חדשה'}
          </Button>
        }
      />

      {/* לשוניות ניווט (Tabs) */}
      <div className="flex border-b border-border gap-6">
        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-3 font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'classes'
              ? 'border-primary text-primary'
              : 'border-transparent text-fg-secondary hover:text-fg'
          }`}
        >
          כיתות אם
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`pb-3 font-medium transition-colors border-b-2 cursor-pointer ${
            activeTab === 'groups'
              ? 'border-primary text-primary'
              : 'border-transparent text-fg-secondary hover:text-fg'
          }`}
        >
          קבוצות לימוד
        </button>
      </div>

      {/* טבלת הנתונים הראשית */}
      <div className="rounded-xl bg-surface border border-border overflow-hidden shadow-sm">
        {activeTab === 'classes' ? (
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50">
                <th className="p-4 font-semibold text-fg">שם הכיתה</th>
                <th className="p-4 font-semibold text-fg">מספר תלמידים</th>
                <th className="p-4 font-semibold text-fg">מחנך/ת</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {classesData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-fg-secondary">
                    אין כיתות להצגה
                  </td>
                </tr>
              ) : (
                classesData.map((cls) => (
                  <tr key={cls.id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="p-4 text-fg font-medium">{cls.name}</td>
                    <td className="p-4 text-fg-secondary">{cls.studentsCount}</td>
                    <td className="p-4 text-fg-secondary">{cls.homeroom}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-secondary/50">
                <th className="p-4 font-semibold text-fg">שם הקבוצה</th>
                <th className="p-4 font-semibold text-fg">שייכות כיתתית</th>
                <th className="p-4 font-semibold text-fg">מספר תלמידים</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groupsData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-fg-secondary">
                    אין קבוצות לימוד להצגה
                  </td>
                </tr>
              ) : (
                groupsData.map((grp) => (
                  <tr key={grp.id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="p-4 text-fg font-medium">{grp.name}</td>
                    <td className="p-4 text-fg-secondary">{grp.classRef}</td>
                    <td className="p-4 text-fg-secondary">{grp.studentsCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* מודל יצירת כיתה או קבוצה חדשה */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={activeTab === 'classes' ? 'יצירת כיתה חדשה' : 'יצירת קבוצת לימוד חדשה'}
        description="הזן את שם המסגרת החדשה להוספה למערכת"
        confirmLabel="שמור וצור"
        confirmLoading={isLoading}
        onConfirm={handleCreateNew}
      >
        <div className="py-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-fg">שם המסגרת</label>
          <input
            type="text"
            className="px-3 py-2 rounded-lg border border-border bg-surface text-fg focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={activeTab === 'classes' ? 'לדוגמה: י"א 3' : 'לדוגמה: חוג משניות'}
            value={frameName}
            onChange={(e) => setFrameName(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}