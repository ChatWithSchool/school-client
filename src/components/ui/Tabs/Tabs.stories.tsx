import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { Tabs, type TabItem } from './Tabs';

const LABELS = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur'];
const items = (n: number): TabItem[] =>
  LABELS.slice(0, n).map((label, i) => ({
    value: `t${i + 1}`,
    label,
    content: (
      <p className="text-body text-fg-secondary">{`${label} lorem ipsum dolor sit amet.`}</p>
    ),
  }));

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { label: 'Lorem', items: items(3) },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

/** In a route: the active tab is in ?tab= (see the address in the Storybook URL bar of the canvas). */
export const Playground: Story = {};

/** Two tab sets on one screen: each keeps its own query parameter (?tab= and ?view=). */
export const TwoSets: Story = {
  render: () => (
    <Stack>
      <Tabs label="Lorem" items={items(3)} />
      <Tabs label="Ipsum" items={items(2)} param="view" />
    </Stack>
  ),
};

/** Style: underline × Count: 2-6. */
export const Variants: Story = {
  render: () => (
    <Stack>
      {[2, 3, 4, 5, 6].map((n) => (
        <Row key={n} title={`Count=${n}`}>
          <Tabs label="Lorem" items={items(n)} syncUrl={false} className="w-full" />
        </Row>
      ))}
    </Stack>
  ),
};

/** default, active (the first), hover, focus, disabled. */
export const States: Story = {
  parameters: pseudoStates,
  render: () => {
    const base = items(3).map(({ content: _c, ...t }) => t);
    return (
      <Row title="States">
        <Demo label="default · active">
          <Tabs label="Lorem" items={base} syncUrl={false} />
        </Demo>
        <Demo label="hover" state="hover">
          <Tabs label="Lorem" items={base} syncUrl={false} />
        </Demo>
        <Demo label="focus" state="focus">
          <Tabs label="Lorem" items={base} syncUrl={false} />
        </Demo>
        <Demo label="disabled">
          <Tabs
            label="Lorem"
            items={base.map((t, i) => ({ ...t, disabled: i === 2 }))}
            syncUrl={false}
          />
        </Demo>
      </Row>
    );
  },
};
