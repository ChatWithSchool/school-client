import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row } from '../internal/story';
import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  args: { label: 'Lorem', value: 60, tone: 'primary' },
};
export default meta;
type Story = StoryObj<typeof Progress>;

export const Playground: Story = { render: (args) => <Progress {...args} className="w-60" /> };

/** Tone: primary, success (state: default). It fills from the right in RTL. */
export const Variants: Story = {
  render: () => (
    <Row title="Tone">
      <Demo label="primary">
        <Progress label="foo" value={60} tone="primary" className="w-60" />
      </Demo>
      <Demo label="success">
        <Progress label="foo" value={60} tone="success" className="w-60" />
      </Demo>
    </Row>
  ),
};
