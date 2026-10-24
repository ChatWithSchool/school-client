import type { Meta, StoryObj } from '@storybook/react-vite';
import { Row, Stack } from '../internal/story';
import { Stepper } from './Stepper';

const NAMES = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet'];

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  args: { steps: NAMES.slice(0, 4), current: 2 },
};
export default meta;
type Story = StoryObj<typeof Stepper>;

export const Playground: Story = {};

/** Steps 3-5 × Current 1-5: each step is done, current or upcoming. */
export const Variants: Story = {
  render: () => (
    <Stack>
      {[3, 4, 5].map((steps) =>
        Array.from({ length: steps }, (_, i) => i + 1).map((current) => (
          <Row key={`${steps}-${current}`} title={`Steps=${steps}, Current=${current}`}>
            <Stepper steps={NAMES.slice(0, steps)} current={current} />
          </Row>
        )),
      )}
    </Stack>
  ),
};
