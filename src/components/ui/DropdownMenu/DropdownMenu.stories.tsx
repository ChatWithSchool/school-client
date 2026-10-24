import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row } from '../internal/story';
import { DropdownMenu, type DropdownMenuItem } from './DropdownMenu';

/** Item: with-icon, default, disabled, danger. */
const ITEMS: DropdownMenuItem[] = [
  { label: 'Lorem', icon: 'pencil', onSelect: () => {} },
  { label: 'Ipsum', onSelect: () => {} },
  { label: 'Dolor', onSelect: () => {}, disabled: true },
  { label: 'Sit amet', icon: 'trash-2', tone: 'danger', onSelect: () => {} },
];

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  args: { label: 'Lorem', items: ITEMS },
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

/** State: closed. Open it with a click or Enter; the arrow keys highlight an item (hover). */
export const Closed: Story = {
  render: (args) => (
    <Row title="State=closed">
      <Demo label="closed">
        <DropdownMenu {...args} />
      </Demo>
    </Row>
  ),
};

/** State: open, with the default, danger, with-icon and disabled items. */
export const Open: Story = {
  args: { open: true },
  render: (args) => (
    <div className="flex h-64 justify-center">
      <DropdownMenu {...args} />
    </div>
  ),
};
