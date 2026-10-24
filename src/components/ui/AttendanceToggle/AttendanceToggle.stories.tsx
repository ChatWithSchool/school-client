import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import {
  AttendanceToggle,
  type AttendanceToggleProps,
  type AttendanceValue,
} from './AttendanceToggle';

const meta: Meta<typeof AttendanceToggle> = {
  title: 'Components/AttendanceToggle',
  component: AttendanceToggle,
  args: { label: 'Lorem Ipsum', value: 'none', size: 'M' },
};
export default meta;
type Story = StoryObj<typeof AttendanceToggle>;

function Live(args: AttendanceToggleProps) {
  const [value, setValue] = useState<AttendanceValue>(args.value);
  return <AttendanceToggle {...args} value={value} onValueChange={setValue} />;
}

export const Playground: Story = { render: (args) => <Live {...args} /> };

const VALUES: AttendanceValue[] = ['present', 'absent', 'late', 'none'];

/** Size M: Value × default, focus, saving, error. Size L (touch, 48): Value × default. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {VALUES.map((value) => (
        <Row key={value} title={`Size=M, Value=${value}`}>
          <Demo label="default">
            <AttendanceToggle label="foo" value={value} onValueChange={() => {}} />
          </Demo>
          <Demo label="focus" state="focus">
            <AttendanceToggle label="foo" value={value} onValueChange={() => {}} />
          </Demo>
          <Demo label="saving">
            <AttendanceToggle label="foo" value={value} onValueChange={() => {}} state="saving" />
          </Demo>
          <Demo label="error">
            <AttendanceToggle label="foo" value={value} onValueChange={() => {}} state="error" />
          </Demo>
        </Row>
      ))}
      <Row title="Size=L (touch)">
        {VALUES.map((value) => (
          <Demo key={value} label={value}>
            <AttendanceToggle label="foo" value={value} onValueChange={() => {}} size="L" />
          </Demo>
        ))}
      </Row>
    </Stack>
  ),
};
