import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Modal,
  Select,
  TextField,
  type BadgeTone,
} from '../../components/ui';

const eventTypes = [
  { value: 'holiday', label: 'חג' },
  { value: 'event', label: 'אירוע' },
  { value: 'parent-day', label: 'ימי הורים' },
  { value: 'vacation', label: 'חופשה' },
];

const scopeOptions = [
  { value: 'all', label: 'כל המוסד' },
  { value: 'primary', label: 'יסודי' },
  { value: 'middle', label: 'חטיבת ביניים' },
  { value: 'high', label: 'תיכון' },
];

const initialEvents = [
  { id: '1', title: 'פסח', type: 'holiday', start: '2026-04-02', end: '2026-04-06', scope: 'all' },
  { id: '2', title: 'יום הורים', type: 'parent-day', start: '2026-03-18', end: '2026-03-18', scope: 'primary' },
  { id: '3', title: 'חופשת חנוכה', type: 'vacation', start: '2026-12-24', end: '2026-12-31', scope: 'all' },
  { id: '4', title: 'ערב בית ספר', type: 'event', start: '2026-05-14', end: '2026-05-14', scope: 'all' },
];

type EventTypeValue = (typeof eventTypes)[number]['value'];

const typePalette: Record<EventTypeValue, { badge: BadgeTone; cell: string; label: string }> = {
  holiday: { badge: 'success', cell: 'bg-success-50 border-success-200', label: 'חג' },
  event: { badge: 'primary', cell: 'bg-primary-50 border-primary-200', label: 'אירוע' },
  'parent-day': { badge: 'warning', cell: 'bg-warning-50 border-warning-200', label: 'ימי הורים' },
  vacation: { badge: 'info', cell: 'bg-info-50 border-info-200', label: 'חופשה' },
};

const weekdayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ש', 'ש'];

const monthDays = Array.from({ length: 35 }, (_, index) => index + 1);

export default function Screen() {
  const [events, setEvents] = useState(initialEvents);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    type: 'holiday',
    start: '2026-03-10',
    end: '2026-03-10',
    scope: 'all',
  });

  const monthLabel = 'מרס 2026';

  const openNewEvent = () => {
    setEditingId(null);
    setForm({ title: '', type: 'holiday', start: '2026-03-10', end: '2026-03-10', scope: 'all' });
    setIsFormOpen(true);
  };

  const openEditEvent = (event: (typeof events)[number]) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      type: event.type,
      start: event.start,
      end: event.end,
      scope: event.scope,
    });
    setIsFormOpen(true);
  };

  const saveEvent = () => {
    if (!form.title.trim()) return;

    if (editingId) {
      setEvents((current) =>
        current.map((event) => (event.id === editingId ? { ...event, ...form } : event)),
      );
    } else {
      setEvents((current) => [{
        id: crypto.randomUUID(),
        title: form.title.trim(),
        type: form.type,
        start: form.start,
        end: form.end,
        scope: form.scope,
      }, ...current]);
    }

    setIsFormOpen(false);
  };

  const deleteEvent = (id: string) => {
    setEvents((current) => current.filter((event) => event.id !== id));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-fg">יומן בית ספרי</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="M">
            חודש קודם
          </Button>
          <Button variant="secondary" size="M">
            {monthLabel}
          </Button>
          <Button size="M" onClick={openNewEvent}>
            הוספת אירוע
          </Button>
        </div>
      </header>

      <Card className="overflow-hidden border border-line bg-surface p-0 shadow-sm">
        <div className="border-b border-line bg-subtle px-5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-body-strong text-fg">
              <span>{monthLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-body text-fg-secondary">
              <span>קיימים {events.length} אירועים</span>
            </div>
          </div>
        </div>

        <div className="grid gap-0 xl:grid-cols-2">
          <div className="border-b border-line xl:border-b-0 xl:border-e">
            <div className="grid grid-cols-7 border-b border-line bg-subtle">
              {weekdayNames.map((label, index) => (
                <div key={`${label}-${index}`} className="px-3 py-3 text-center text-label text-fg-secondary">
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {monthDays.map((day, index) => {
                const event = events[index % events.length];
                const palette = typePalette[event.type] ?? typePalette.holiday;
                const isCurrentDay = day === 10 || day === 18 || day === 24;

                return (
                  <button
                    key={`${day}-${index}`}
                    type="button"
                    className={[
                      'relative min-h-24 border-b border-e border-line p-2 text-start transition hover:bg-subtle',
                      day > 28 ? 'opacity-60' : '',
                      isCurrentDay ? 'bg-primary-50' : 'bg-surface',
                    ].join(' ')}
                    onClick={openNewEvent}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-body-strong text-fg">{day}</span>
                      {isCurrentDay && <Badge tone="primary" size="S">יום מיוחד</Badge>}
                    </div>
                    {event && (
                      <div className={['mt-2 rounded-md border px-2 py-1 text-label', palette.cell].join(' ')}>
                        {event.title}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <h2 className="mb-3 text-h2 text-fg">מקרא סוגי אירועים</h2>
              <div className="space-y-2">
                {eventTypes.map((item) => (
                  <div key={item.value} className="flex items-center justify-between gap-2 rounded-md bg-subtle px-2 py-2">
                    <span className="text-body text-fg">{item.label}</span>
                    <Badge tone={typePalette[item.value as EventTypeValue].badge} size="S">
                      {item.label}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-h2 text-fg">אירועים קרובים</h2>
              <div className="space-y-2">
                {events.map((event) => (
                  <div key={event.id} className="rounded-md border border-line bg-page p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-body-strong text-fg">{event.title}</span>
                      <Badge tone={typePalette[event.type as EventTypeValue].badge} size="S">
                        {typePalette[event.type as EventTypeValue].label}
                      </Badge>
                    </div>
                    <div className="mb-2 text-body text-fg-secondary">
                      {event.start} – {event.end}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="S" onClick={() => openEditEvent(event)}>
                        עריכה
                      </Button>
                      <Button variant="danger" size="S" onClick={() => deleteEvent(event.id)}>
                        מחיקה
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={editingId ? 'עריכת אירוע' : 'הוספת אירוע'}
        description="הגדרו את סוג האירוע, התאריכים וההיקף שלו."
        size="M"
        confirmLabel={editingId ? 'שמור' : 'הוסף אירוע'}
        cancelLabel="ביטול"
        onConfirm={saveEvent}
      >
        <div className="space-y-4">
          <TextField
            label="כותרת האירוע"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="לדוגמה: חופשת פסח"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="סוג אירוע"
              options={eventTypes}
              value={form.type}
              onValueChange={(value) => setForm((current) => ({ ...current, type: value }))}
              placeholder="בחרו סוג"
            />

            <Select
              label="חל על"
              options={scopeOptions}
              value={form.scope}
              onValueChange={(value) => setForm((current) => ({ ...current, scope: value }))}
              placeholder="בחרו היקף"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DatePicker
              mode="single"
              label="תאריך התחלה"
              value={form.start ? new Date(`${form.start}T00:00:00`) : null}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  start: value ? value.toISOString().slice(0, 10) : '',
                }))
              }
            />

            <DatePicker
              mode="single"
              label="תאריך סיום"
              value={form.end ? new Date(`${form.end}T00:00:00`) : null}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  end: value ? value.toISOString().slice(0, 10) : '',
                }))
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
