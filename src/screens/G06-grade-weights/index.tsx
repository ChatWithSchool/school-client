import { useState } from 'react';
import { Button, PageHeader, Select, Table, type TableColumn } from '../../components/ui';
import { canWrite, usePermission } from '../../features/auth/usePermission';

type WeightItem = {
  id: string;
  type: string;
  weight: number;
};

const LAYER_OPTIONS = [
  { value: 'all', label: 'הכול' },
  { value: 'ז', label: "שכבה ז'" },
  { value: 'ח', label: "שכבה ח'" },
];

const SUBJECT_OPTIONS = [
  { value: 'all', label: 'הכול' },
  { value: 'מתמטיקה', label: 'מתמטיקה' },
  { value: 'אנגלית', label: 'אנגלית' },
];

const TERM_OPTIONS = [
  { value: 'all', label: 'הכול' },
  { value: 'א', label: "מחצית א'" },
  { value: 'ב', label: "מחצית ב'" },
];

export default function G06GradeWeights() {
  const permission = usePermission('G06');
  const editable = canWrite(permission);
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [weights, setWeights] = useState<WeightItem[]>([
    { id: 'exam', type: 'מבחן', weight: 50 },
    { id: 'quiz', type: 'בוחן', weight: 20 },
    { id: 'assignment', type: 'מטלה', weight: 20 },
    { id: 'participation', type: 'השתתפות', weight: 10 },
  ]);

  const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);

  const columns: TableColumn<WeightItem>[] = [
    {
      key: 'type',
      header: 'סוג הערכה',
      cell: (item) => <span className="text-body-strong">{item.type}</span>,
    },
    {
      key: 'weight',
      header: 'משקל %',
      className: 'w-48 text-center',
      cell: (item) => (
        <label className="inline-flex items-center justify-center gap-1">
          <span className="sr-only">משקל עבור {item.type}</span>
          <input
            aria-label={`משקל עבור ${item.type}`}
            type="number"
            min={0}
            max={100}
            value={item.weight}
            disabled={!editable}
            onChange={(event) => {
              const nextWeight = Number(event.target.value);
              setWeights((current) =>
                current.map((weight) =>
                  weight.id === item.id ? { ...weight, weight: nextWeight } : weight,
                ),
              );
            }}
            className="num w-16 rounded-sm border border-transparent bg-transparent text-center text-body text-fg focus:border-line focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500/35 disabled:cursor-not-allowed disabled:text-fg-muted"
          />
          <span aria-hidden="true">%</span>
        </label>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="משקלים לציון סופי" />

      <div className="flex flex-wrap gap-3">
        <Select
          label="שכבה"
          options={LAYER_OPTIONS}
          value={selectedLayer}
          onValueChange={setSelectedLayer}
          className="w-44"
        />
        <Select
          label="מקצוע"
          options={SUBJECT_OPTIONS}
          value={selectedSubject}
          onValueChange={setSelectedSubject}
          className="w-44"
        />
        <Select
          label="מחצית"
          options={TERM_OPTIONS}
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          className="w-44"
        />
      </div>

      <section className="overflow-hidden rounded-lg border border-line bg-surface shadow-xs">
        <h2 className="px-5 py-3 text-body-strong text-fg">משקלים</h2>
        <Table
          caption="משקלים לציון סופי"
          columns={columns}
          rows={weights}
          getRowId={(item) => item.id}
          density="compact"
          wrapperClassName="rounded-none border-0"
        />
      </section>

      <div
        className="flex min-h-11 items-center justify-end rounded-md bg-info-50 px-4 py-2 text-label text-info-700"
        role="status"
        aria-live="polite"
      >
        <span>
          סה&quot;כ <span className="font-semibold">{totalWeight}%</span>
        </span>
        {totalWeight !== 100 && (
          <span className="ms-2 text-danger-700">הסכום חייב להיות 100%</span>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="primary"
          size="S"
          disabled={!editable || totalWeight !== 100}
          aria-label="שמירת משקלים"
        >
          שמור
        </Button>
        <Button
          variant="secondary"
          size="S"
          disabled={!editable}
          aria-label="העתקת משקלים משכבה אחרת"
        >
          העתק משכבה אחרת
        </Button>
      </div>
    </div>
  );
}
