import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  args: { label: 'Lorem ipsum' },
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const Playground: Story = {};

/** On: off, on × default, focus, disabled. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {[false, true].map((on) => (
        <Row key={String(on)} title={`On=${on ? 'on' : 'off'}`}>
          <Demo label="default">
            <Switch checked={on} label="Lorem" />
          </Demo>
          <Demo label="focus" state="focus">
            <Switch checked={on} label="Lorem" />
          </Demo>
          <Demo label="disabled">
            <Switch checked={on} label="Lorem" disabled />
          </Demo>
        </Row>
      ))}
    </Stack>
  ),
};
