import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../components/Icon';
import { NotFoundState } from '../../components/StateViews';
import {
  AttendanceChip,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  MetricCard,
  Table,
  Tabs,
  type AttendanceStatus,
} from '../../components/ui';
import { pathFor } from '../../routes/screens';
import { cx, text } from '../../styles/recipes';
import BehaviorNotes from '../S06-behavior-notes';
import {
  attendanceFor,
  attendanceRecordsFor,
  attendanceStatsFor,
  feedbackFor,
  findStudent,
  fullName,
  gradesFor,
  summaryFor,
  type AttendanceRecord,
  type GradeTrend,
  type Student,
  type SubjectGrade,
} from './mock';
import { behaviorNotesPath } from './paths';

/**
 * S03 - student card: header, three summary cards and the tabs
 * details / attendance / grades / behavior notes (the active tab is kept in ?tab=).
 * Route: /students/s03/:id
 */
export default function Screen() {
  const { id } = useParams();
  const student = id ? findStudent(id) : undefined;
  if (!student) return <NotFoundState />;
  return <StudentCard student={student} />;
}

function StudentCard({ student }: { student: Student }) {
  const navigate = useNavigate();
  const summary = summaryFor(student.id);
  const name = fullName(student);
  // links to the other screens; the student travels in ?student=
  const goTo = (screenId: string) => navigate(`${pathFor(screenId)}?student=${student.id}`);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'תלמידים', to: pathFor('S01') }, { label: name }]} />

      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={name} size="L" />
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <h1 className={text.h1}>{name}</h1>
            <Badge tone="info">{student.classLabel}</Badge>
            {student.tags.map((t) => (
              <Badge key={t.label} tone={t.tone}>
                {t.label}
              </Badge>
            ))}
            <AttendanceChip status={student.todayStatus} />
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button icon="trailing" iconName="pencil" onClick={() => goTo('S02')}>
              עריכה
            </Button>
            <Button variant="secondary" onClick={() => goTo('S07')}>
              העברת כיתה
            </Button>
            <Button variant="secondary" onClick={() => navigate(behaviorNotesPath(student.id))}>
              הערות התנהגות
            </Button>
          </div>
        </div>
      </Card>

      {summary && (
        <section aria-label="תמצית" className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="נוכחות החודש"
            value={`${summary.attendancePercent}%`}
            tone={summary.attendancePercent < summary.attendanceTarget ? 'warning' : 'neutral'}
            trend={summary.attendancePercent < summary.attendanceTarget ? 'down' : 'none'}
            trendText={
              summary.attendancePercent < summary.attendanceTarget
                ? `מתחת ליעד שנקבע ${summary.attendanceTarget}%`
                : 'בהתאם ליעד'
            }
          />
          <MetricCard
            label="ממוצע ציונים"
            value={summary.gradeAverage}
            tone={summary.gradeDelta < 0 ? 'warning' : 'neutral'}
            trend={summary.gradeDelta < 0 ? 'down' : summary.gradeDelta > 0 ? 'up' : 'none'}
            trendText={
              summary.gradeDelta === 0
                ? 'ללא שינוי'
                : `${summary.gradeDelta < 0 ? 'ירידה' : 'עלייה'} של ${Math.abs(summary.gradeDelta)} נקודות`
            }
          />
          <MetricCard
            label="הערות פתוחות"
            value={summary.openNotes}
            trendText={
              summary.openNotes > 0 ? `אחרונה לפני ${summary.lastNoteDaysAgo} ימים` : 'אין הערות פתוחות'
            }
          />
        </section>
      )}

      <Tabs
        label="לשוניות כרטיס התלמיד"
        items={[
          { value: 'details', label: 'פרטים', content: <DetailsTab student={student} /> },
          {
            value: 'attendance',
            label: 'נוכחות',
            content: <AttendanceTab studentId={student.id} />,
          },
          {
            value: 'grades',
            label: 'ציונים',
            content: <GradesTab studentId={student.id} />,
          },
          {
            value: 'notes',
            label: 'הערות התנהגות',
            // S06 is rendered inside the tab, only while the tab is open (S03.3)
            content: <BehaviorNotes studentId={student.id} embedded />,
          },
        ]}
      />
    </div>
  );
}

/* ------------------------- S03 · details tab (פרטים) -------------------------- */

function DetailsTab({ student }: { student: Student }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card>
        <h2 className={`${text.h3} mb-4`}>פרטים אישיים</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
          <Field label="שם משפחה" value={student.lastName} />
          <Field label="שם פרטי" value={student.firstName} />
          <Field label="תאריך לידה" value={<span className="num">{student.birthDate}</span>} />
          <Field label="תעודת זהות" value={<span className="num">{student.nationalId}</span>} />
          <Field label="טלפון הורה" value={<span className="num">{student.guardianPhone}</span>} />
          <Field label="כיתה" value={student.classLabel} />
          <Field label="כתובת" value={student.address} />
          <Field label="אימייל הורה" value={<span className="num">{student.guardianEmail}</span>} />
        </dl>
      </Card>

      <Card>
        <h2 className={`${text.h3} mb-4`}>נוכחות: 30 ימים אחרונים</h2>
        <AttendanceStrip studentId={student.id} />
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-caption text-fg-secondary">{label}</dt>
      <dd className="text-body-strong text-fg">{value}</dd>
    </div>
  );
}

/* ----------------------------- S03.1 · attendance ---------------------------- */

const DAY_STYLE: Record<AttendanceStatus, { icon: IconName; tone: string; label: string }> = {
  present: { icon: 'check', tone: 'bg-success-50 text-success-700', label: 'נוכח' },
  absent: { icon: 'x', tone: 'bg-danger-50 text-danger-700', label: 'נעדר' },
  late: { icon: 'clock', tone: 'bg-warning-50 text-warning-700', label: 'איחור' },
  excused: { icon: 'check', tone: 'bg-info-50 text-info-700', label: 'מאושר' },
  unreported: { icon: 'minus', tone: 'bg-subtle text-fg-secondary', label: 'לא דווח' },
};

/** 30 small day squares (oldest first), a legend and the absences of the last 10 days. */
function AttendanceStrip({ studentId }: { studentId: string }) {
  const days = attendanceFor(studentId);
  const last10 = days.slice(-10);
  const absences = last10.filter((d) => d === 'absent').length;
  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-10 gap-1.5" aria-label="נוכחות 30 ימים אחרונים">
        {days.map((status, i) => {
          const s = DAY_STYLE[status];
          return (
            <li
              key={i}
              role="img"
              aria-label={`יום ${i + 1}: ${s.label}`}
              className={cx('flex h-7 items-center justify-center rounded-md', s.tone)}
            >
              <Icon name={s.icon} size={14} />
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap gap-2">
        <AttendanceChip status="present" size="S" />
        <AttendanceChip status="absent" size="S" />
        <AttendanceChip status="late" size="S" />
      </div>
      <p className="text-body text-fg-secondary">
        {absences} היעדרויות מתוך {last10.length} ימי לימוד אחרונים
      </p>
    </div>
  );
}

function AttendanceTab({ studentId }: { studentId: string }) {
  const stats = attendanceStatsFor(studentId);
  return (
    <div className="space-y-6">
      <section aria-label="סיכום נוכחות" className="grid gap-4 md:grid-cols-3">
        <MetricCard label="איחורים" value={stats.lates} trendText="" />
        <MetricCard label="ימי היעדרות" value={stats.absences} trendText="" />
        <MetricCard label="אחוז נוכחות" value={`${stats.percent}%`} trendText="" />
      </section>

      <Card>
        <h2 className={`${text.h3} mb-4`}>פירוט</h2>
        <Table<AttendanceRecord>
          caption="פירוט נוכחות של התלמיד"
          rows={attendanceRecordsFor(studentId)}
          getRowId={(row) => row.id}
          columns={[
            { key: 'date', header: 'תאריך', numeric: true, cell: (row) => row.date },
            { key: 'lesson', header: 'שיעור', cell: (row) => row.lesson },
            {
              key: 'status',
              header: 'סטטוס',
              cell: (row) => <AttendanceChip status={row.status} />,
            },
            { key: 'note', header: 'הערה', cell: (row) => row.note },
          ]}
        />
      </Card>
    </div>
  );
}

/* ------------------------------- S03.2 · grades ------------------------------ */

const TREND: Record<GradeTrend, { label: string; icon?: IconName; tone: string }> = {
  up: { label: 'עלייה', icon: 'trending-up', tone: 'text-success-700' },
  down: { label: 'ירידה', icon: 'trending-down', tone: 'text-warning-700' },
  stable: { label: 'יציב', tone: 'text-fg-secondary' },
};

function GradesTab({ studentId }: { studentId: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className={`${text.h3} mb-4`}>ציונים לפי מקצוע</h2>
        <Table<SubjectGrade>
          caption="ציוני התלמיד לפי מקצוע"
          rows={gradesFor(studentId)}
          getRowId={(row) => row.subject}
          columns={[
            {
              key: 'subject',
              header: 'מקצוע',
              cell: (row) => <span className="text-body-strong">{row.subject}</span>,
            },
            {
              key: 'recent',
              header: 'ציונים אחרונים',
              numeric: true,
              cell: (row) => row.recent.join(' · '),
            },
            {
              key: 'average',
              header: 'ממוצע',
              numeric: true,
              cell: (row) => <span className="text-body-strong">{row.average}</span>,
            },
            {
              key: 'trend',
              header: 'מגמה',
              cell: (row) => {
                const t = TREND[row.trend];
                return (
                  <span className={cx('inline-flex items-center gap-1', t.tone)}>
                    {t.icon && <Icon name={t.icon} size={14} />}
                    {t.label}
                  </span>
                );
              },
            },
          ]}
        />
      </Card>

      <Card>
        <h2 className={`${text.h3} mb-4`}>משוב מורים</h2>
        <ul className="divide-y divide-line">
          {feedbackFor(studentId).map((f) => (
            <li key={f.subject} className="py-3 text-body text-fg">
              <span className="text-body-strong">{f.subject}:</span> {f.text}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
