import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { GradeCell, type GradeCellState } from './GradeCell';

const meta: Meta<typeof GradeCell> = {
  title: 'Components/GradeCell',
  component: GradeCell,
  args: { label: 'Lorem', defaultValue: '87' },
};
export default meta;
type Story = StoryObj<typeof GradeCell>;

export const Playground: Story = {};

const STATES: { state: GradeCellState; value?: string; error?: string }[] = [
  { state: 'empty' },
  { state: 'filled', value: '87' },
  { state: 'error', value: '120', error: 'Lorem ipsum' },
  { state: 'saving', value: '87' },
  { state: 'saved', value: '87' },
];

/** State × Interaction: default, hover, focus. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {STATES.map(({ state, value, error }) => (
        <Row key={state} title={`State=${state}`}>
          <Demo label="default">
            <GradeCell label="foo" state={state} defaultValue={value} error={error} />
          </Demo>
          <Demo label="hover" state="hover">
            <GradeCell label="foo" state={state} defaultValue={value} error={error} />
          </Demo>
          <Demo label="focus" state="focus">
            <GradeCell label="foo" state={state} defaultValue={value} error={error} />
          </Demo>
        </Row>
      ))}
    </Stack>
  ),
};
