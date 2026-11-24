import { useState } from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Modal,
  PageHeader,
  SearchField,
  Table,
  type TableColumn,
  Tabs,
  TextField,
} from '../../components/ui';
import { ErrorState, ForbiddenState, LoadingSkeleton } from '../../components/StateViews';

interface ClassItem {
  id: string;
  name: string;
  grade: string;
  homeroom: string;
  studentsCount: number;
}

interface GroupItem {
  id: string;
  name: string;
  classRef: string;
  studentsCount: number;
  members: MemberItem[];
}

interface MemberItem {
  id: string;
  name: string;
  className: string;
}

const MOCK_CLASSES: ClassItem[] = [
  { id: '1', name: 'ז1', grade: "ז'", homeroom: 'נועם גולדשטיין', studentsCount: 28 },
  { id: '2', name: 'ז2', grade: "ז'", homeroom: 'טל חדד', studentsCount: 27 },
  { id: '3', name: 'ח1', grade: "ח'", homeroom: 'עמית כהן', studentsCount: 30 },
  { id: '4', name: 'ח2', grade: "ח'", homeroom: 'אופק שפירא', studentsCount: 29 },
  { id: '5', name: 'ח3', grade: "ח'", homeroom: 'רז אברהמי', studentsCount: 26 },
  { id: '6', name: 'ט1', grade: "ט'", homeroom: 'שחר ביטון', studentsCount: 31 },
];

const MOCK_STUDENTS: MemberItem[] = [
  { id: 's1', name: 'יוסי לוי', className: 'ז1' },
  { id: 's2', name: 'דנה כהן', className: 'ז2' },
  { id: 's3', name: 'אורי שפירא', className: 'ח1' },
  { id: 's4', name: 'מיכל אברהם', className: 'ח2' },
];

const INITIAL_GROUPS: GroupItem[] = [
  { id: 'g1', name: "הקבצה א' מתמטיקה", classRef: 'ז1', studentsCount: 2, members: [MOCK_STUDENTS[0], MOCK_STUDENTS[1]] },
  { id: 'g2', name: 'חוג גמרא עיון', classRef: 'חוצת-כיתה', studentsCount: 1, members: [MOCK_STUDENTS[2]] },
];

const CLASS_COLUMNS: TableColumn<ClassItem>[] = [
  {
    key: 'name',
    header: 'שם',
    cell: (row) => <span className="font-medium">{row.name}</span>,
  },
  { key: 'grade', header: 'שכבה', cell: (row) => row.grade },
  {
    key: 'homeroom',
    header: 'מחנך',
    cell: (row) => (
      <span className="flex items-center gap-2">
        <Avatar name={row.homeroom} size="S" />
        {row.homeroom}
      </span>
    ),
  },
  {
    key: 'studentsCount',
    header: 'מספר תלמידים',
    cell: (row) => <Badge tone="neutral">{String(row.studentsCount)}</Badge>,
    numeric: true,
  },
];

const GROUP_COLUMNS: TableColumn<GroupItem>[] = [
  {
    key: 'name',
    header: 'שם הקבוצה',
    cell: (row) => <span className="font-medium">{row.name}</span>,
  },
  { key: 'classRef', header: 'שייכות כיתתית', cell: (row) => row.classRef },
  {
    key: 'studentsCount',
    header: 'מספר תלמידים',
    cell: (row) => <Badge tone="neutral">{String(row.studentsCount)}</Badge>,
    numeric: true,
  },
];

type ScreenState = 'loading' | 'error' | 'forbidden' | 'ok';

export default function Screen() {
  const [screenState] = useState<ScreenState>('ok');

  // ניהול הלשונית הפעילה דרך ה-URL בהתאם לדרישת המפרט (?tab=...)
  const [activeTab, setActiveTab] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'groups';
  });

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTab);
    window.history.pushState({}, '', url.toString());
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // שדות טופס יצירה
  const [frameName, setFrameName] = useState('');
  const [grade, setGrade] = useState('');
  const [homeroom, setHomeroom] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const [classesData, setClassesData] = useState<ClassItem[]>(MOCK_CLASSES);
  const [groupsData, setGroupsData] = useState<GroupItem[]>(INITIAL_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // סינון תוצאות החיפוש בהתאם לתלמידים שטרם שויכו לקבוצה הנבחרת
  const currentGroupMembers = selectedGroup?.members || [];
  const searchResults = searchQuery.trim()
    ? MOCK_STUDENTS.filter(
      (s) =>
        s.name.includes(searchQuery) &&
        !currentGroupMembers.some((m) => m.id === s.id),
    ).map((s) => ({ id: s.id, label: `${s.name} (${s.className})` }))
    : undefined;

  const handleCreateNew = async () => {
    setFormError('');
    if (!frameName.trim()) {
      setFormError('נא להזין שם');
      return false;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));

      if (activeTab === 'classes') {
        const existingClass = classesData.find(
          (c) => c.name.trim().toLowerCase() === frameName.trim().toLowerCase()
        );
        const existingHomeroom = homeroom.trim() ? classesData.find(
          (c) => c.homeroom.trim().toLowerCase() === homeroom.trim().toLowerCase()
        ) : null;

        if (existingClass) {
          setFormError(`הכיתה "${frameName}" כבר קיימת במערכת.`);
          setIsLoading(false);
          return false;
        }
        if (existingHomeroom) {
          setFormError(`המחנך "${homeroom}" כבר משויך לכיתה אחרת (${existingHomeroom.name}). מחנך יכול להיות משויך לכיתה אחת בלבד.`);
          setIsLoading(false);
          return false;
        }

        setClassesData((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            name: frameName.trim(),
            grade: grade.trim() || "ז'",
            homeroom: homeroom.trim() || 'טרם הוגדר',
            studentsCount: 0,
          },
        ]);
      } else {
        const classRef =
          selectedClasses.length > 0 ? selectedClasses.join(', ') : 'חוצת-כיתה';
        setGroupsData((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            name: frameName.trim(),
            classRef,
            studentsCount: 0,
            members: []
          },
        ]);
      }

      setIsModalOpen(false);
      setFrameName('');
      setGrade('');
      setHomeroom('');
      setSelectedClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openMembers = (group: GroupItem) => {
    setSelectedGroup(group);
    setSearchQuery('');
    setIsMembersModalOpen(true);
  };

  const addMember = (result: { id: string; label: string }) => {
    if (!selectedGroup) return;
    const student = MOCK_STUDENTS.find((s) => s.id === result.id);
    if (!student) return;

    setGroupsData((prev) =>
      prev.map((g) => {
        if (g.id === selectedGroup.id) {
          const updatedMembers = [...g.members, student];
          const updatedGroup = {
            ...g,
            members: updatedMembers,
            studentsCount: updatedMembers.length,
          };
          setSelectedGroup(updatedGroup);
          return updatedGroup;
        }
        return g;
      }),
    );
    setSearchQuery('');
  };

  const removeMember = (id: string) => {
    if (!selectedGroup) return;

    setGroupsData((prev) =>
      prev.map((g) => {
        if (g.id === selectedGroup.id) {
          const updatedMembers = g.members.filter((m) => m.id !== id);
          const updatedGroup = {
            ...g,
            members: updatedMembers,
            studentsCount: updatedMembers.length,
          };
          setSelectedGroup(updatedGroup);
          return updatedGroup;
        }
        return g;
      }),
    );
  };

  const toggleClassSelection = (className: string) => {
    setSelectedClasses((prev) =>
      prev.includes(className) ? prev.filter((name) => name !== className) : [...prev, className],
    );
  };

  if (screenState === 'loading') return <LoadingSkeleton />;
  if (screenState === 'error')
    return <ErrorState message="אירעה שגיאה בטעינת הנתונים" onRetry={() => { }} />;
  if (screenState === 'forbidden') return <ForbiddenState />;

  const tabItems = [
    {
      value: 'groups',
      label: 'קבוצות לימוד',
      content: (
        <Table
          caption="קבוצות לימוד"
          columns={[
            ...GROUP_COLUMNS,
            {
              key: 'actions',
              header: '',
              cell: (row) => (
                <Button variant="secondary" size="S" onClick={() => openMembers(row)}>
                  שיוך תלמידים
                </Button>
              ),
            },
          ]}
          rows={groupsData}
          getRowId={(r) => r.id}
        />
      ),
    },
    {
      value: 'classes',
      label: 'כיתות',
      content: (
        <Table
          caption="כיתות"
          columns={CLASS_COLUMNS}
          rows={classesData}
          getRowId={(r) => r.id}
        />
      ),
    },
    { value: 'special', label: 'קבוצות ייעודיות', disabled: true },
  ];

  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      <PageHeader
        title="כיתות וקבוצות לימוד"
        subtitle="רשימה, יצירה ושיוך תלמידים לכיתות ולקבוצות"
        actions={
          <Button variant="primary" onClick={() => { setFormError(''); setIsModalOpen(true); }}>
            {activeTab === 'classes' ? 'הוספת כיתה' : 'הוספת קבוצה'}
          </Button>
        }
      />

      <Tabs
        label="ניווט בין כיתות וקבוצות"
        items={tabItems}
        value={activeTab}
        onValueChange={handleTabChange}
        syncUrl={true}
      />

      {/* מודל יצירה */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={activeTab === 'classes' ? 'יצירת כיתה חדשה' : 'יצירת קבוצת לימוד חדשה'}
        description="הזן את פרטי המסגרת החדשה"
        confirmLabel="שמור וצור"
        confirmLoading={isLoading}
        onConfirm={handleCreateNew}
      >
        <div className="flex flex-col gap-4 py-2">
          {formError && (
            <Alert tone="danger">
              {formError}
            </Alert>
          )}

          <TextField
            label={activeTab === 'classes' ? 'שם הכיתה' : 'שם הקבוצה'}
            placeholder={activeTab === 'classes' ? "לדוגמה: ז'1" : "לדוגמה: הקבצה א' מתמטיקה"}
            value={frameName}
            onChange={(e) => setFrameName(e.target.value)}
          />

          {activeTab === 'classes' ? (
            <>
              <TextField
                label="שכבה"
                placeholder="לדוגמה: ז'"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
              <TextField
                label="שם המחנך (מחנך אחד לכיתה)"
                placeholder="לדוגמה: נועם גולדשטיין"
                value={homeroom}
                onChange={(e) => setHomeroom(e.target.value)}
              />
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-fg">
                שייכות כיתתית (אפשר לבחור כמה כיתות)
              </span>
              <div className="flex flex-wrap gap-2">
                {classesData.map((classItem) => {
                  const isSelected = selectedClasses.includes(classItem.name);
                  return (
                    <button
                      key={classItem.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleClassSelection(classItem.name)}
                      className={`rounded-md border px-3 py-1.5 text-body transition-colors ${isSelected
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-line bg-surface text-fg hover:border-line-strong'
                        }`}
                    >
                      {classItem.name}
                    </button>
                  );
                })}
              </div>
              <span className="text-sm text-fg-secondary">
                ללא בחירה, הקבוצה תוגדר כחוצת-כיתה.
              </span>
            </div>
          )}
        </div>
      </Modal>

      {/* מודל שיוך תלמידים */}
      <Modal
        open={isMembersModalOpen}
        onOpenChange={setIsMembersModalOpen}
        title={`שיוך תלמידים – ${selectedGroup?.name ?? ''}`}
        description="הוסף או הסר תלמידים מהקבוצה"
        confirmLabel="סגור"
        footer="single"
        onConfirm={() => setIsMembersModalOpen(false)}
      >
        <div className="flex flex-col gap-4 py-2">
          <SearchField
            label="הוספת תלמיד"
            placeholder="חפש תלמיד להוספה"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            results={searchResults}
            onResultSelect={addMember}
          />
          <ul className="flex flex-col divide-y divide-line">
            {currentGroupMembers.length === 0 && (
              <li className="py-4 text-center text-body text-fg-secondary">אין חברים בקבוצה</li>
            )}
            {currentGroupMembers.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-2">
                  <Avatar name={m.name} size="S" />
                  <span className="text-body text-fg">{m.name}</span>
                  <Badge tone="neutral">{m.className}</Badge>
                </span>
                <Button variant="secondary" size="S" onClick={() => removeMember(m.id)}>
                  הסרה
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
}