import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

const PATH: BreadcrumbItem[] = [
  { label: 'Lorem', to: '/foo' },
  { label: 'Ipsum', to: '/foo/bar' },
  { label: 'Dolor', to: '/foo/bar/baz' },
  { label: 'Sit amet' },
];
/** Depth n: the first n-1 links and a current page. */
const depth = (n: number) => [...PATH.slice(0, n - 1), PATH[PATH.length - 1]];

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  args: { items: depth(3) },
};
export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Playground: Story = {};

/** Depth: 2, 3, 4. States: default (a link, with hover and focus) and current (the last item). */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      <Row title="Depth">
        {[2, 3, 4].map((n) => (
          <Demo key={n} label={`Depth=${n}`}>
            <Breadcrumbs items={depth(n)} />
          </Demo>
        ))}
      </Row>
      <Row title="States (Depth=2)">
        <Demo label="default">
          <Breadcrumbs items={depth(2)} />
        </Demo>
        <Demo label="hover" state="hover">
          <Breadcrumbs items={depth(2)} />
        </Demo>
        <Demo label="focus" state="focus">
          <Breadcrumbs items={depth(2)} />
        </Demo>
      </Row>
    </Stack>
  ),
};
