import { useState } from 'react';
import { Badge, Button, Card, PageHeader, Select, Table } from '../../components/ui';
import type { TableColumn } from '../../components/ui';
import {
  DAY_OPTIONS,
  MOCK_TEACHERS,
  MOCK_UNCOVERED,
  SLOT_OPTIONS,
  type AvailableTeacher,
} from './mock';

export default function Screen() {
  const [day, setDay] = useState('all');
  const [slot, setSlot] = useState('all');
  const [assignedIds, setAssignedIds] = useState<string[]>([]);

  const columns: TableColumn<AvailableTeacher>[] = [
    { key: 'name', header: 'שם', cell: (t) => t.name },
    { key: 'subjects', header: 'מקצועות', cell: (t) => t.subjects },
    { key: 'hours', header: 'שעות באותו יום', numeric: true, cell: (t) => t.hoursThatDay },
    {
      key: 'action',
      header: 'פעולה',
      cell: (t) => (
        <Button
          disabled={assignedIds.includes(t.id)}
          onClick={() => setAssignedIds([...assignedIds, t.id])}
        >
          {assignedIds.includes(t.id) ? 'שובץ' : 'שבץ'}
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader  title="ממלא מקום ומורים זמינים"/>

      <section aria-label="סינון" className="flex gap-4">
        <Select label="יום" options={DAY_OPTIONS} value={day} onValueChange={setDay} />
        <Select label="שעה" options={SLOT_OPTIONS} value={slot} onValueChange={setSlot} />
      </section>

      <Card>
      <section aria-label="מורים זמינים" className="flex flex-col gap-3">
        <h2 className="text-h3">מורים זמינים</h2>
        <Table
          caption="מורים זמינים"
          columns={columns}
          rows={MOCK_TEACHERS}
          getRowId={(t) => t.id}
        />
      </section>
      </Card>

      <Card>
      <section aria-label="שיעורים ללא מורה" className="flex flex-col gap-3">
          <h2 className="text-h3">שיעורים ללא מורה</h2>
          {MOCK_UNCOVERED.map((l) => (
            <div key={l.id} className="flex items-center justify-between border-b border-line py-2">
              <span>
                שיעור {l.lessonNumber} · {l.subject}
              </span>
              <span className="flex items-center gap-3">
                {l.className}
                <Badge tone="danger">מורה נעדר</Badge>
              </span>
            </div>
          ))}
        </section>
      </Card>
    </div>
  );
}