import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  args: { label: 'Lorem', removable: true, onRemove: () => {} },
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Playground: Story = {};

/** Removable: off, on × default, hover, focus. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {[false, true].map((removable) => (
        <Row key={String(removable)} title={`Removable=${removable ? 'on' : 'off'}`}>
          <Demo label="default">
            <Tag label="Lorem" onRemove={removable ? () => {} : undefined} />
          </Demo>
          <Demo label="hover" state="hover">
            <Tag label="Lorem" onRemove={removable ? () => {} : undefined} />
          </Demo>
          {removable && (
            <Demo label="focus" state="focus">
              <Tag label="Lorem" onRemove={() => {}} />
            </Demo>
          )}
        </Row>
      ))}
    </Stack>
  ),
};
