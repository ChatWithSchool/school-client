import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { Avatar, type AvatarSize } from './Avatar';

/** A neutral placeholder picture (no real person). */
const PICTURE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#BACDFF"/><circle cx="24" cy="19" r="8" fill="#5C82FF"/><rect x="10" y="31" width="28" height="17" rx="8" fill="#5C82FF"/></svg>',
  );

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'Lorem Ipsum', size: 'M' },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

const SIZES: AvatarSize[] = ['S', 'M', 'L'];

export const Playground: Story = {};

/** Size × Type (state: default). */
export const Variants: Story = {
  render: () => (
    <Stack>
      <Row title="Type=initials">
        {SIZES.map((size) => (
          <Demo key={size} label={size}>
            <Avatar name="Lorem Ipsum" size={size} />
          </Demo>
        ))}
      </Row>
      <Row title="Type=image">
        {SIZES.map((size) => (
          <Demo key={size} label={size}>
            <Avatar name="Lorem Ipsum" src={PICTURE} size={size} />
          </Demo>
        ))}
      </Row>
    </Stack>
  ),
};
