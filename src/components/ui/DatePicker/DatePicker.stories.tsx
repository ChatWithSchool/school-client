import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Demo, Row, Stack } from '../internal/story';
import { DatePicker, type DateRange } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
};
export default meta;
type Story = StoryObj<typeof DatePicker>;

const DAY = new Date(2026, 0, 12);

function SingleDemo(props: { error?: string; defaultOpen?: boolean; empty?: boolean }) {
  const [value, setValue] = useState<Date | null>(props.empty ? null : DAY);
  return (
    <DatePicker
      label="Lorem"
      // hidden inputs with yyyy-mm-dd, for a form
      name="lorem"
      value={value}
      onChange={setValue}
      error={props.error}
      defaultOpen={props.defaultOpen}
      className="w-72"
    />
  );
}

function RangeDemo(props: { error?: string; defaultOpen?: boolean; empty?: boolean }) {
  const [value, setValue] = useState<DateRange>(
    props.empty ? { from: null, to: null } : { from: DAY, to: new Date(2026, 0, 16) },
  );
  return (
    <DatePicker
      mode="range"
      label="Lorem"
      // hidden inputs with yyyy-mm-dd, for a form
      name="lorem"
      value={value}
      onChange={setValue}
      error={props.error}
      defaultOpen={props.defaultOpen}
      className="w-72"
    />
  );
}

/** Mode: single, range × closed, error. The open state has its own stories. */
export const VariantsAndStates: Story = {
  render: () => (
    <Stack>
      <Row title="Mode=single">
        <Demo label="closed (empty)">
          <SingleDemo empty />
        </Demo>
        <Demo label="closed">
          <SingleDemo />
        </Demo>
        <Demo label="error">
          <SingleDemo error="Lorem ipsum dolor" />
        </Demo>
      </Row>
      <Row title="Mode=range">
        <Demo label="closed (empty)">
          <RangeDemo empty />
        </Demo>
        <Demo label="closed">
          <RangeDemo />
        </Demo>
        <Demo label="error">
          <RangeDemo error="Lorem ipsum dolor" />
        </Demo>
      </Row>
    </Stack>
  ),
};

/** Mode=single, State=open. */
export const OpenSingle: Story = {
  name: 'Mode=single, State=open',
  render: () => (
    <div className="h-96">
      <SingleDemo defaultOpen />
    </div>
  ),
};

/** Mode=range, State=open: the first and last days and the days between. */
export const OpenRange: Story = {
  name: 'Mode=range, State=open',
  render: () => (
    <div className="h-96">
      <RangeDemo defaultOpen />
    </div>
  ),
};
