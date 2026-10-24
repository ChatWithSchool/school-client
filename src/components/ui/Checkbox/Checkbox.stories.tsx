import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { Checkbox, type CheckedState } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Lorem ipsum' },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

const CHECKED: [string, CheckedState][] = [
  ['off', false],
  ['on', true],
  ['mixed', 'mixed'],
];

export const Playground: Story = {};

/** Checked: off, on, mixed × default, hover, focus, disabled. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {CHECKED.map(([name, value]) => (
        <Row key={name} title={`Checked=${name}`}>
          <Demo label="default">
            <Checkbox checked={value} label="Lorem" />
          </Demo>
          <Demo label="hover" state="hover">
            <Checkbox checked={value} label="Lorem" />
          </Demo>
          <Demo label="focus" state="focus">
            <Checkbox checked={value} label="Lorem" />
          </Demo>
          <Demo label="disabled">
            <Checkbox checked={value} label="Lorem" disabled />
          </Demo>
        </Row>
      ))}
    </Stack>
  ),
};
