import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row } from '../internal/story';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: { shape: 'line' },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Playground: Story = {};

/** Shape: line, block, table-row, card (state: animated). */
export const Variants: Story = {
  render: () => (
    <Row title="Shape">
      <Demo label="line">
        <Skeleton shape="line" className="w-64" />
      </Demo>
      <Demo label="block">
        <Skeleton shape="block" className="w-64" />
      </Demo>
      <Demo label="table-row">
        <Skeleton shape="table-row" className="w-96" />
      </Demo>
      <Demo label="card">
        <Skeleton shape="card" className="w-64" />
      </Demo>
    </Row>
  ),
};
