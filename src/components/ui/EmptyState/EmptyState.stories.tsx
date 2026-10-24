import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Demo, Row } from '../internal/story';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  args: { variant: 'first-use', title: 'Lorem ipsum', text: 'Dolor sit amet.' },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Playground: Story = {};

/** Variant: first-use, no-results, error (state: default). */
export const Variants: Story = {
  render: () => (
    <Row title="Variant">
      <Demo label="first-use">
        <EmptyState
          className="w-96"
          variant="first-use"
          title="Lorem ipsum"
          text="Dolor sit amet."
          action={<Button>Lorem</Button>}
        />
      </Demo>
      <Demo label="no-results">
        <EmptyState
          className="w-96"
          variant="no-results"
          title="Lorem ipsum"
          text="Dolor sit amet."
          action={<Button variant="ghost">Ipsum</Button>}
        />
      </Demo>
      <Demo label="error">
        <EmptyState
          className="w-96"
          variant="error"
          title="Lorem ipsum"
          text="Dolor sit amet."
          action={<Button variant="secondary">Dolor</Button>}
        />
      </Demo>
    </Row>
  ),
};
