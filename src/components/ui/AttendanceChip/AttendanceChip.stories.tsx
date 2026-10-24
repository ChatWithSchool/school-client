import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { AttendanceChip, type AttendanceStatus } from './AttendanceChip';

const meta: Meta<typeof AttendanceChip> = {
  title: 'Components/AttendanceChip',
  component: AttendanceChip,
  args: { status: 'present', size: 'M' },
};
export default meta;
type Story = StoryObj<typeof AttendanceChip>;

const STATUSES: AttendanceStatus[] = ['present', 'absent', 'late', 'excused', 'unreported'];

export const Playground: Story = {};

/** Status × Size (state: default). */
export const Variants: Story = {
  render: () => (
    <Stack>
      {(['S', 'M'] as const).map((size) => (
        <Row key={size} title={`Size=${size}`}>
          {STATUSES.map((status) => (
            <Demo key={status} label={status}>
              <AttendanceChip status={status} size={size} />
            </Demo>
          ))}
        </Row>
      ))}
    </Stack>
  ),
};
