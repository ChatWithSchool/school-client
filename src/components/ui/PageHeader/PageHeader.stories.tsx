import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Row, Stack } from '../internal/story';
import { PageHeader } from './PageHeader';

const CRUMBS = [
  { label: 'Lorem', to: '/foo' },
  { label: 'Ipsum', to: '/foo/bar' },
  { label: 'Dolor' },
];

/** The primary action comes first: in RTL it sits next to the title. */
const ACTIONS = [
  <Button key="p" icon="leading" iconName="plus">
    Lorem
  </Button>,
  <Button key="s" variant="secondary">
    Ipsum
  </Button>,
  <Button key="g" variant="ghost">
    Dolor
  </Button>,
];

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  args: { title: 'Lorem ipsum', subtitle: 'Dolor sit amet, consectetur adipiscing.' },
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Playground: Story = {};

/** Actions: 0-3 × Breadcrumbs: on, off (state: default). */
export const Variants: Story = {
  render: () => (
    <Stack>
      {(['on', 'off'] as const).map((bc) =>
        [0, 1, 2, 3].map((n) => (
          <Row key={`${bc}${n}`} title={`Actions=${n}, Breadcrumbs=${bc}`}>
            <PageHeader
              className="w-full"
              title="Lorem ipsum"
              subtitle="Dolor sit amet, consectetur adipiscing."
              breadcrumbs={bc === 'on' ? CRUMBS : undefined}
              actions={n ? ACTIONS.slice(0, n) : undefined}
            />
          </Row>
        )),
      )}
    </Stack>
  ),
};
