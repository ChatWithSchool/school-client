import { card, text } from '../styles/recipes';

/** A temporary page for a screen that is not built yet. Replace it in the screen's folder. */
export function ScreenPlaceholder({
  id,
  name,
  owner,
}: {
  id: string;
  name: string;
  owner: string;
}) {
  return (
    <div className={card}>
      <p className="text-caption text-fg-muted">{id}</p>
      <h1 className={text.h1}>{name}</h1>
      <p className={`${text.muted} mt-2`}>המסך עוד לא נבנה. אחראית: {owner}.</p>
      <p className={`${text.muted} mt-1`}>
        המפרט נמצא בקובץ <code dir="ltr">src/screens/{id}-…/SPEC.md</code>.
      </p>
    </div>
  );
}
