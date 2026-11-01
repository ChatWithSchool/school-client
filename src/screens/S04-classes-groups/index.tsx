import { useState } from 'react';
import {
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

const MOCK_GROUPS: GroupItem[] = [
  { id: 'g1', name: "הקבצה א' מתמטיקה", classRef: 'ז1', studentsCount: 15 },
  { id: 'g2', name: 'חוג גמרא עיון', classRef: 'חוצת-כיתה', studentsCount: 12 },
];

const MOCK_STUDENTS: MemberItem[] = [
  { id: 's1', name: 'יוסי לוי', className: 'ז1' },
  { id: 's2', name: 'דנה כהן', className: 'ז2' },
  { id: 's3', name: 'אורי שפירא', className: 'ח1' },
  { id: 's4', name: 'מיכל אברהם', className: 'ח2' },
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
    cell: (row) => <Badge tone="neutral" label={String(row.studentsCount)} />,
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
    cell: (row) => <Badge tone="neutral" label={String(row.studentsCount)} />,
    numeric: true,
  },
];

type ScreenState = 'loading' | 'error' | 'forbidden' | 'ok';

export default function Screen() {
  const [screenState] = useState<ScreenState>('ok');
  const [activeTab, setActiveTab] = useState<string>('groups');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [frameName, setFrameName] = useState('');
  const [grade, setGrade] = useState('');
  const [homeroom, setHomeroom] = useState('');
  const [classesData, setClassesData] = useState<ClassItem[]>(MOCK_CLASSES);
  const [groupsData, setGroupsData] = useState<GroupItem[]>(MOCK_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery.trim()
    ? MOCK_STUDENTS.filter(
        (s) =>
          s.name.includes(searchQuery) &&
          !members.some((m) => m.id === s.id),
      ).map((s) => ({ id: s.id, label: `${s.name} (${s.className})` }))
    : undefined;

  const handleCreateNew = async () => {
    if (!frameName.trim()) return;
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      if (activeTab === 'classes') {
        setClassesData((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            name: frameName,
            grade: grade || "ז'",
            homeroom: homeroom || 'טרם הוגדר',
            studentsCount: 0,
          },
        ]);
      } else {
        setGroupsData((prev) => [
          ...prev,
          { id: String(Date.now()), name: frameName, classRef: 'חוצת-כיתה', studentsCount: 0 },
        ]);
      }
      setIsModalOpen(false);
      setFrameName('');
      setGrade('');
      setHomeroom('');
    } finally {
      setIsLoading(false);
    }
  };

  const openMembers = (group: GroupItem) => {
    setSelectedGroup(group);
    setMembers(MOCK_STUDENTS.slice(0, group.studentsCount % 4));
    setSearchQuery('');
    setIsMembersModalOpen(true);
  };

  const addMember = (result: { id: string; label: string }) => {
    const student = MOCK_STUDENTS.find((s) => s.id === result.id);
    if (!student) return;
    setMembers((prev) => [...prev, student]);
    setGroupsData((prev) =>
      prev.map((g) =>
        g.id === selectedGroup?.id ? { ...g, studentsCount: g.studentsCount + 1 } : g,
      ),
    );
    setSearchQuery('');
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setGroupsData((prev) =>
      prev.map((g) =>
        g.id === selectedGroup?.id ? { ...g, studentsCount: g.studentsCount - 1 } : g,
      ),
    );
  };

  if (screenState === 'loading') return <LoadingSkeleton />;
  if (screenState === 'error')
    return <ErrorState message="אירעה שגיאה בטעינת הנתונים" onRetry={() => {}} />;
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
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            {activeTab === 'classes' ? 'הוספת כיתה' : 'הוספת קבוצה'}
          </Button>
        }
      />

      <Tabs
        label="ניווט בין כיתות וקבוצות"
        items={tabItems}
        value={activeTab}
        onValueChange={setActiveTab}
        syncUrl={false}
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
          <TextField
            label="שם הכיתה / קבוצה"
            placeholder={activeTab === 'classes' ? "לדוגמה: ז'1" : "לדוגמה: הקבצה א'"}
            value={frameName}
            onChange={(e) => setFrameName(e.target.value)}
          />
          {activeTab === 'classes' && (
            <>
              <TextField
                label="שכבה"
                placeholder="לדוגמה: ז'"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
              <TextField
                label="שם המחנך"
                placeholder="לדוגמה: נועם גולדשטיין"
                value={homeroom}
                onChange={(e) => setHomeroom(e.target.value)}
              />
            </>
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
            {members.length === 0 && (
              <li className="py-4 text-center text-body text-fg-secondary">אין חברים בקבוצה</li>
            )}
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                <span className="flex items-center gap-2">
                  <Avatar name={m.name} size="S" />
                  <span className="text-body text-fg">{m.name}</span>
                  <Badge tone="neutral" label={m.className} />
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
