import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { FileDropzone, type FileDropzoneState } from './FileDropzone';

const meta: Meta<typeof FileDropzone> = {
  title: 'Components/FileDropzone',
  component: FileDropzone,
  args: { onFiles: () => {}, onReject: () => {}, state: 'idle', accept: '.csv,.xlsx' },
};
export default meta;
type Story = StoryObj<typeof FileDropzone>;

/** Drop a file on the zone or use the button. */
export const Playground: Story = { render: (args) => <FileDropzone {...args} className="w-96" /> };

const STATES: FileDropzoneState[] = ['idle', 'drag-over', 'uploading', 'error', 'done'];

/** State: idle, drag-over, uploading, error, done (and the focus of the button). */
export const States: Story = {
  parameters: pseudoStates,
  render: () => (
    <Row title="State">
      {STATES.map((state) => (
        <Demo key={state} label={state}>
          <FileDropzone
            onFiles={() => {}}
            state={state}
            fileName="foo.csv"
            progress={60}
            error="Lorem ipsum dolor sit amet."
            className="w-96"
          />
        </Demo>
      ))}
      <Demo label="idle · focus" state="focus">
        <FileDropzone onFiles={() => {}} className="w-96" />
      </Demo>
    </Row>
  ),
};
