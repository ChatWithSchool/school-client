import * as Menu from '@radix-ui/react-dropdown-menu';
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from '../../../styles/recipes';
import { Icon, type IconName } from '../../Icon';
import { IconButton } from '../IconButton/IconButton';

export type DropdownMenuItem = {
  label: string;
  onSelect: () => void;
  /** Figma `Item: with-icon`. */
  icon?: IconName;
  /** Figma `Item: danger`: a delete action, in red. */
  tone?: 'default' | 'danger';
  disabled?: boolean;
};

export type DropdownMenuProps = Omit<
  ComponentPropsWithoutRef<typeof Menu.Content>,
  'children' | 'dir'
> & {
  items: DropdownMenuItem[];
  /** Names the default trigger (a ghost IconButton with ellipsis-vertical). */
  label: string;
  /** A custom trigger: an element that forwards its ref (Button, IconButton). */
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/**
 * The actions menu of a table row (Radix). The arrow keys move between the items, Enter picks,
 * Escape closes and returns focus to the trigger.
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(function DropdownMenu(
  { items, label, trigger, open, onOpenChange, align = 'end', sideOffset = 4, className, ...rest },
  ref,
) {
  return (
    <Menu.Root open={open} onOpenChange={onOpenChange}>
      <Menu.Trigger asChild>
        {trigger ?? (
          <IconButton
            icon="ellipsis-vertical"
            label={label}
            className="data-[state=open]:bg-primary-100 data-[state=open]:text-primary-700"
          />
        )}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cx(
            'z-50 min-w-48 rounded-md border border-line bg-surface py-1 shadow-md focus:outline-none',
            className,
          )}
          {...rest}
        >
          {items.map((item) => {
            const danger = item.tone === 'danger';
            return (
              <Menu.Item
                key={item.label}
                disabled={item.disabled}
                onSelect={item.onSelect}
                // the highlight is the focus sign; no focus ring on top of it
                className={cx(
                  'flex h-9 cursor-pointer select-none items-center gap-2 px-3 text-body outline-none focus-visible:ring-0',
                  'data-[disabled]:cursor-not-allowed data-[disabled]:text-ink-400',
                  danger
                    ? 'text-danger-700 data-[highlighted]:bg-danger-50'
                    : 'text-fg data-[highlighted]:bg-subtle',
                )}
              >
                {item.icon && (
                  <Icon
                    name={item.icon}
                    size={16}
                    className={cx(
                      danger ? 'text-danger-700' : 'text-fg-secondary',
                      item.disabled && 'text-ink-400',
                    )}
                  />
                )}
                {item.label}
              </Menu.Item>
            );
          })}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
});
