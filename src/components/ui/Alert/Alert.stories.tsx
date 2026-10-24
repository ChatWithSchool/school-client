import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { Alert, type AlertTone } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  args: { tone: 'info', children: 'Lorem ipsum dolor sit amet.' },
};
export default meta;
type Story = StoryObj<typeof Alert>;

const TONES: AlertTone[] = ['info', 'success', 'warning', 'danger'];

export const Playground: Story = {};

/** Tone × Dismissible (state: default). */
export const Variants: Story = {
  render: () => (
    <Stack>
      {(['off', 'on'] as const).map((d) => (
        <Row key={d} title={`Dismissible=${d}`}>
          {TONES.map((tone) => (
            <Demo key={tone} label={tone}>
              <Alert
                tone={tone}
                dismissible={d === 'on'}
                onDismiss={() => undefined}
                title="Lorem ipsum"
                className="w-80"
              >
                Dolor sit amet, consectetur adipiscing elit.
              </Alert>
            </Demo>
          ))}
        </Row>
      ))}
    </Stack>
  ),
};
