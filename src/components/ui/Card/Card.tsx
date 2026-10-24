import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type Ref } from 'react';
import { cx } from '../../../styles/recipes';
import { focusRing } from '../internal/styles';

export type CardPadding = 'M' | 'L';

type CommonProps = {
  /** Figma `Padding`: M = 16, L = 24. */
  padding?: CardPadding;
};

/** A static card (Figma `Interactive: off`): a div. */
type StaticCardProps = CommonProps & HTMLAttributes<HTMLDivElement> & { interactive?: false };

/**
 * A card that is clicked as a whole (Figma `Interactive: on`): a real button, so it has the
 * keyboard and the focus ring for free. For a card that opens a page, put a Link inside instead.
 */
type InteractiveCardProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { interactive: true };

export type CardProps = StaticCardProps | InteractiveCardProps;

const base = 'block rounded-lg border border-line bg-surface shadow-xs';
const PADDING: Record<CardPadding, string> = { M: 'p-4', L: 'p-6' };

/** The white surface for dashboard blocks and grouped content (the card recipe). */
export const Card = forwardRef<HTMLDivElement | HTMLButtonElement, CardProps>(
  function Card(props, ref) {
    if (props.interactive) {
      const { interactive, padding = 'L', className, type = 'button', ...rest } = props;
      return (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type={type}
          className={cx(
            base,
            PADDING[padding],
            'w-full text-start hover:border-line-strong hover:shadow-sm disabled:cursor-not-allowed',
            focusRing,
            className,
          )}
          {...rest}
        />
      );
    }
    const { interactive, padding = 'L', className, ...rest } = props;
    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={cx(base, PADDING[padding], className)}
        {...rest}
      />
    );
  },
);
