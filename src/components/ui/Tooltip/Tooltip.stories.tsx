import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '../IconButton/IconButton';
import { Demo, Row } from '../internal/story';
import { Tooltip, type TooltipPlacement } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: { content: 'Lorem ipsum', placement: 'top' },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

/** Hover or focus the button. */
export const Playground: Story = {
  render: (args) => (
    <div className="p-16">
      <Tooltip {...args}>
        <IconButton icon="info" label="foo" />
      </Tooltip>
    </div>
  ),
};

const PLACEMENTS: TooltipPlacement[] = ['top', 'bottom', 'start', 'end'];

/** Placement: top, bottom, start (right in RTL), end (state: visible). */
export const Variants: Story = {
  render: () => (
    <Row title="Placement">
      {PLACEMENTS.map((placement) => (
        <Demo key={placement} label={placement}>
          <div className="px-24 py-12">
            <Tooltip content="Lorem ipsum" placement={placement} defaultOpen>
              <IconButton icon="info" label="foo" />
            </Tooltip>
          </div>
        </Demo>
      ))}
    </Row>
  ),
};
