import { useState, type FormEvent } from 'react';
import {
  useCreateAnnouncementMutation,
  useListAnnouncementsQuery,
  useMarkAnnouncementReadMutation,
} from '../../api/announcementsApi';
import { errorMessage, fieldErrors } from '../../api/errors';
import {
  EmptyState,
  ErrorState,
  ForbiddenState,
  LoadingSkeleton,
} from '../../components/StateViews';
import { canWrite, usePermission } from '../../features/auth/usePermission';
import { badge, btn, card, cx, field, text } from '../../styles/recipes';

/**
 * REFERENCE SCREEN (a training example: the "management announcements" screen was deferred from version 1).
 * It shows the whole client pattern: permissions, an RTK Query list with loading, empty and error
 * states, a form with field errors from the server, and a test with mock data.
 * The matching server module: school-server/src/modules/announcements.
 */
export default function ReferenceAnnouncements() {
  const level = usePermission('I10');
  const { data, isLoading, isError, error, refetch } = useListAnnouncementsQuery();
  const [create, { isLoading: saving, error: saveError }] = useCreateAnnouncementMutation();
  const [markRead] = useMarkAnnouncementReadMutation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const fields = fieldErrors(saveError);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await create({ title, body }).unwrap();
      setTitle('');
      setBody('');
    } catch {
      /* shown below from saveError */
    }
  }

  // the server answers 403 when the role has no access to this screen
  if ((error as { status?: number } | undefined)?.status === 403) return <ForbiddenState />;

  return (
    <div className="space-y-6">
      <h1 className={text.h1}>הודעות הנהלה</h1>

      {canWrite(level) && (
        <form onSubmit={onSubmit} className={cx(card, 'space-y-4')} noValidate>
          <h2 className={text.h3}>הודעה חדשה</h2>
          {saveError && !Object.keys(fields).length && (
            <ErrorState message={errorMessage(saveError)} />
          )}
          <div>
            <label htmlFor="title" className={field.label}>
              כותרת
            </label>
            <input
              id="title"
              className={field.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={Boolean(fields.title)}
            />
            {fields.title && <p className={field.error}>{fields.title}</p>}
          </div>
          <div>
            <label htmlFor="body" className={field.label}>
              תוכן
            </label>
            <textarea
              id="body"
              className={field.textarea}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              aria-invalid={Boolean(fields.body)}
            />
            {fields.body && <p className={field.error}>{fields.body}</p>}
          </div>
          <button type="submit" className={btn.primary} disabled={saving}>
            {saving ? 'שומר…' : 'פרסום'}
          </button>
        </form>
      )}

      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState message={errorMessage(error)} onRetry={refetch} />}
      {data && data.items.length === 0 && (
        <EmptyState title="אין עדיין הודעות" text="הודעות שהנהלה תפרסם יופיעו כאן." />
      )}
      {data && data.items.length > 0 && (
        <ul className="space-y-3">
          {data.items.map((a) => (
            <li key={a.id} className={cx(card, 'flex items-start gap-4')}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={text.h3}>{a.title}</h3>
                  {a.pinned && <span className={badge.primary}>מוצמד</span>}
                  {!a.read && <span className={badge.warning}>חדש</span>}
                </div>
                <p className={`${text.muted} mt-1`}>{a.body}</p>
              </div>
              {!a.read && (
                <button type="button" className={btn.secondary} onClick={() => markRead(a.id)}>
                  סימון כנקרא
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
