import { forwardRef, useRef, useState, type DragEvent, type HTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';
import { Button } from '../Button/Button';
import { Progress } from '../Progress/Progress';
import { focusRing } from '../internal/styles';

/** Figma `State`. drag-over is also set by itself while a file is dragged over the zone. */
export type FileDropzoneState = 'idle' | 'drag-over' | 'uploading' | 'error' | 'done';

export type FileDropzoneProps = Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> & {
  state?: FileDropzoneState;
  /** Called with the chosen or dropped files. */
  onFiles: (files: File[]) => void;
  /** The input's accept: ".csv,.xlsx". */
  accept?: string;
  multiple?: boolean;
  /** The line under the call to action: the formats and the size limit. */
  hint?: string;
  /** While uploading and when done. */
  fileName?: string;
  /** 0 to 100, while uploading. */
  progress?: number;
  /** The message of the error state. */
  error?: string;
  disabled?: boolean;
};

const CIRCLE: Record<'upload' | 'error' | 'done', { icon: IconName; tone: string }> = {
  upload: { icon: 'upload', tone: 'bg-primary-50 text-primary-600' },
  error: { icon: 'circle-alert', tone: 'bg-danger-50 text-danger-700' },
  done: { icon: 'circle-check', tone: 'bg-success-50 text-success-700' },
};

/**
 * A zone to drop a file on, or to choose one with the button (screens I02, S05, T04). The parent
 * runs the upload and sets `state`, `progress` and `error`.
 */
export const FileDropzone = forwardRef<HTMLDivElement, FileDropzoneProps>(function FileDropzone(
  {
    state = 'idle',
    onFiles,
    accept,
    multiple,
    hint = 'CSV או Excel, עד 5MB',
    fileName,
    progress = 0,
    error = 'הקובץ לא נקלט. נסי שוב.',
    disabled,
    className,
    'aria-label': ariaLabel = 'העלאת קובץ',
    ...rest
  },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const accepting = state === 'idle' || state === 'drag-over';
  const over = accepting && (dragging || state === 'drag-over');
  const circle = CIRCLE[state === 'error' ? 'error' : state === 'done' ? 'done' : 'upload'];
  const choose = () => input.current?.click();

  const drop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      aria-busy={state === 'uploading' || undefined}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={drop}
      className={cx(
        'flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center',
        state === 'error'
          ? 'border-danger-600 bg-surface'
          : over
            ? 'border-primary-500 bg-primary-50'
            : 'border-line-strong bg-surface',
        disabled && 'opacity-60',
        className,
      )}
      {...rest}
    >
      <span className={cx('flex h-12 w-12 items-center justify-center rounded-full', circle.tone)}>
        <Icon name={circle.icon} size={24} />
      </span>

      {accepting && (
        <>
          <p className="text-body text-fg">
            גררו קובץ לכאן או{' '}
            <button
              type="button"
              disabled={disabled}
              onClick={choose}
              className={cx(
                'rounded-sm text-body-strong text-primary-600 hover:underline',
                focusRing,
              )}
            >
              בחרו קובץ
            </button>
          </p>
          {hint && <p className="text-caption text-fg-muted">{hint}</p>}
        </>
      )}

      {state === 'uploading' && (
        <>
          {fileName && <p className="text-body-strong text-fg">{fileName}</p>}
          <Progress value={progress} label="העלאת הקובץ" className="max-w-60" />
          <p className="text-caption text-fg-secondary" aria-live="polite">
            מעלה… <span className="num">{`${Math.round(progress)}%`}</span>
          </p>
        </>
      )}

      {state === 'error' && (
        <>
          <p role="alert" className="text-body text-danger-700">
            {error}
          </p>
          <Button variant="secondary" size="S" onClick={choose} disabled={disabled}>
            בחירת קובץ אחר
          </Button>
        </>
      )}

      {state === 'done' && (
        <>
          <p role="status" className="text-body text-fg">
            {fileName ? `${fileName} הועלה` : 'הקובץ הועלה'}
          </p>
          <Button variant="ghost" size="S" onClick={choose} disabled={disabled}>
            החלפת קובץ
          </Button>
        </>
      )}

      <input
        ref={input}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = '';
        }}
      />
    </div>
  );
});
