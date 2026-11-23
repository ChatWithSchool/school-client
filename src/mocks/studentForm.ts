export interface StudentFormRecord {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  className: string;
  phone: string;
  phoneExtra: string;
  parentEmail: string;
  address: string;
  notes: string;
  tags: string[];
}

export const CLASS_OPTIONS = [
  { value: '', label: 'בחרו כיתה' },
  { value: 'ז1', label: 'ז1' },
  { value: 'ז2', label: 'ז2' },
  { value: 'ח1', label: 'ח1' },
  { value: 'ח2', label: 'ח2' },
  { value: 'ח3', label: 'ח3' },
  { value: 'ט1', label: 'ט1' },
];

export const TAG_OPTIONS = ['חדש', 'מעקב', 'תמיכה', 'חוג'];

export const EXISTING_STUDENT_IDS = ['123456782', '987654321'];
export const EXISTING_PARENT_EMAILS = ['amit.biton@example.com'];

export const MOCK_STUDENTS_BY_ID: Record<string, StudentFormRecord> = {
  '1': {
    id: '1',
    firstName: 'נועם',
    lastName: 'ביטון',
    nationalId: '123456782',
    birthDate: '2012-01-01',
    className: 'ח1',
    phone: '050-000-0000',
    phoneExtra: '',
    parentEmail: 'amit.biton@example.com',
    address: '',
    notes: '',
    tags: ['חדש'],
  },
  '2': {
    id: '2',
    firstName: 'יובל',
    lastName: 'קליין',
    nationalId: '234567891',
    birthDate: '2012-04-05',
    className: 'ח1',
    phone: '050-000-0001',
    phoneExtra: '',
    parentEmail: '',
    address: '',
    notes: '',
    tags: [],
  },
  '3': {
    id: '3',
    firstName: 'עדי',
    lastName: 'פרץ',
    nationalId: '345678912',
    birthDate: '2011-07-12',
    className: 'ח2',
    phone: '050-000-0002',
    phoneExtra: '',
    parentEmail: '',
    address: '',
    notes: '',
    tags: ['מעקב'],
  },
};
