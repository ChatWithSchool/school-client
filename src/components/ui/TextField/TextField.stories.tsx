import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  args: { label: 'Lorem ipsum', placeholder: 'Dolor sit amet' },
};
export default meta;
type Story = StoryObj<typeof TextField>;

export const Playground: Story = {};

/** Prefix/Suffix: none, icon, text. */
export const Adornments: Story = {
  render: () => (
    <Row title="Size=M, Label=on">
      <Demo label="none">
        <TextField label="Lorem" placeholder="foo" className="w-64" />
      </Demo>
      <Demo label="icon">
        <TextField label="Lorem" placeholder="foo" prefix={{ icon: 'search' }} className="w-64" />
      </Demo>
      <Demo label="text">
        <TextField label="Lorem" placeholder="foo" suffix={{ text: 'bar' }} className="w-64" />
      </Demo>
    </Row>
  ),
};

/** default, hover, focus, filled, error, disabled, read-only. */
export const States: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      <Row title="States">
        <Demo label="default">
          <TextField label="Lorem" placeholder="foo" className="w-64" />
        </Demo>
        <Demo label="hover" state="hover">
          <TextField label="Lorem" placeholder="foo" className="w-64" />
        </Demo>
        <Demo label="focus" state="focus">
          <TextField label="Lorem" placeholder="foo" className="w-64" />
        </Demo>
        <Demo label="filled">
          <TextField label="Lorem" defaultValue="Lorem ipsum" className="w-64" />
        </Demo>
      </Row>
      <Row title="States">
        <Demo label="error">
          <TextField
            label="Lorem"
            defaultValue="foo"
            error="Lorem ipsum dolor sit amet"
            required
            className="w-64"
          />
        </Demo>
        <Demo label="disabled">
          <TextField label="Lorem" defaultValue="foo" disabled className="w-64" />
        </Demo>
        <Demo label="read-only">
          <TextField label="Lorem" defaultValue="foo" readOnly className="w-64" />
        </Demo>
        <Demo label="hint">
          <TextField label="Lorem" placeholder="foo" hint="Lorem ipsum dolor" className="w-64" />
        </Demo>
      </Row>
    </Stack>
  ),
};
