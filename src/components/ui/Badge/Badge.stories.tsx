import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { Badge, type BadgeSize, type BadgeTone } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Lorem', tone: 'neutral', size: 'M' },
};
export default meta;
type Story = StoryObj<typeof Badge>;

const TONES: BadgeTone[] = ['neutral', 'primary', 'success', 'warning', 'danger', 'info', 'accent'];
const SIZES: BadgeSize[] = ['S', 'M'];

export const Playground: Story = {};

/** Tone × Size (state: default). */
export const Variants: Story = {
  render: () => (
    <Stack>
      {SIZES.map((size) => (
        <Row key={size} title={`Size=${size}`}>
          {TONES.map((tone) => (
            <Demo key={tone} label={tone}>
              <Badge tone={tone} size={size}>
                Lorem
              </Badge>
            </Demo>
          ))}
        </Row>
      ))}
    </Stack>
  ),
};
