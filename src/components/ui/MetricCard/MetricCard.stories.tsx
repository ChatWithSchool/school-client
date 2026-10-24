import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { MetricCard, type MetricTone, type MetricTrend } from './MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Components/MetricCard',
  component: MetricCard,
  args: { label: 'Lorem ipsum', value: '94%', trend: 'up', trendText: 'Lorem 2%' },
};
export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Playground: Story = { render: (args) => <MetricCard {...args} className="w-64" /> };

const TRENDS: MetricTrend[] = ['none', 'up', 'down'];
const TONES: MetricTone[] = ['neutral', 'warning'];

/** Trend × Tone × State: default, loading. */
export const VariantsAndStates: Story = {
  render: () => (
    <Stack>
      {TONES.map((tone) => (
        <Row key={tone} title={`Tone=${tone}`}>
          {TRENDS.map((trend) => (
            <Demo key={trend} label={`Trend=${trend}`}>
              <MetricCard
                label="Lorem ipsum"
                value="94%"
                trend={trend}
                trendText={trend === 'none' ? undefined : 'Lorem 2%'}
                tone={tone}
                className="w-64"
              />
            </Demo>
          ))}
          <Demo label="loading">
            <MetricCard label="Lorem ipsum" value="94%" tone={tone} loading className="w-64" />
          </Demo>
        </Row>
      ))}
    </Stack>
  ),
};
