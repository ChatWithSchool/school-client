import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  args: { label: 'Lorem ipsum', placeholder: 'Dolor sit amet', rows: 3 },
};
export default meta;
type Story = StoryObj<typeof TextArea>;

export const Playground: Story = {};

/** Rows 3 and 5, then default, focus, error, disabled. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      <Row title="Rows">
        <Demo label="3">
          <TextArea label="Lorem" placeholder="foo" rows={3} className="w-72" />
        </Demo>
        <Demo label="5">
          <TextArea label="Lorem" placeholder="foo" rows={5} className="w-72" />
        </Demo>
      </Row>
      <Row title="States (Rows=3)">
        <Demo label="default">
          <TextArea label="Lorem" placeholder="foo" className="w-72" />
        </Demo>
        <Demo label="focus" state="focus">
          <TextArea label="Lorem" placeholder="foo" className="w-72" />
        </Demo>
        <Demo label="error">
          <TextArea label="Lorem" defaultValue="foo" error="Lorem ipsum dolor" className="w-72" />
        </Demo>
        <Demo label="disabled">
          <TextArea label="Lorem" defaultValue="foo" disabled className="w-72" />
        </Demo>
      </Row>
    </Stack>
  ),
};
