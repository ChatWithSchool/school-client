import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../../styles/recipes';

export type AvatarSize = 'S' | 'M' | 'L';

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  /** The person's name: it gives the initials and the accessible name. */
  name: string;
  /** Figma `Type`: image when there is a picture, initials otherwise (or when it fails to load). */
  src?: string;
  size?: AvatarSize;
};

const SIZE: Record<AvatarSize, string> = {
  S: 'h-6 w-6 text-caption',
  M: 'h-8 w-8 text-label',
  L: 'h-12 w-12 text-body-lg font-semibold',
};

/** The first letter of the first two words: "Lorem Ipsum" gives "LI". */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('');
}

/** A round picture of a person, or the initials when there is no picture. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 'M', className, ...rest },
  ref,
) {
  // remember which picture failed, so a new src is tried again
  const [failedSrc, setFailedSrc] = useState<string>();
  const image = src && src !== failedSrc;
  return (
    <span
      ref={ref}
      role="img"
      aria-label={name}
      className={cx(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-primary-700',
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {image ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span aria-hidden="true">{initialsOf(name) || '?'}</span>
      )}
    </span>
  );
});
