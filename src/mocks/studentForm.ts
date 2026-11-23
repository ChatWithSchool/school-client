import { seedStudents, CLASSES } from './shared/people';

export interface StudentFormData {
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: Date | null;
  className: string;
  phone: string;
  phoneExtra: string;
  parentEmail: string;
  address: string;
  notes: string;
  tags: string[];
}

export const EMPTY_STUDENT_FORM: StudentFormData = {
  firstName: '',
  lastName: '',
  nationalId: '',
  birthDate: null,
  className: '',
  phone: '',
  phoneExtra: '',
  parentEmail: '',
  address: '',
  notes: '',
  tags: [],
};

// תעודות זהות תקינות עם ספרת ביקורת לבדיקת כפילות (למשל 123456782 ו-246813571)
export const EXISTING_NATIONAL_IDS: string[] = ['123456782', '246813571'];
export const EXISTING_PARENT_EMAILS: string[] = ['amit.biton@example.com'];

const CLASS_NAME_BY_ID: Record<string, string> = Object.fromEntries(
  CLASSES.map((cls) => [cls.id, cls.name]),
);

const SEEDED_STUDENTS = seedStudents();

export const MOCK_STUDENTS_BY_ID: Record<string, StudentFormData> = Object.fromEntries(
  SEEDED_STUDENTS.map((student, index) => [
    student.id,
    {
      firstName: student.firstName,
      lastName: student.lastName,
      nationalId: index === 0 ? '123456782' : index === 1 ? '246813571' : '',
      birthDate: new Date(2012, index % 12, (index % 27) + 1),
      className: CLASS_NAME_BY_ID[student.classId] ?? '',
      phone: `050-000-${String(index).padStart(4, '0')}`,
      phoneExtra: '',
      parentEmail: index === 0 ? 'amit.biton@example.com' : '',
      address: '',
      notes: '',
      tags: [...student.tags],
    },
  ]),
);