import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../Avatar/Avatar';
import { IconButton } from '../IconButton/IconButton';
import { Row, Stack } from '../internal/story';
import { SearchField } from '../SearchField/SearchField';
import { TopBar } from './TopBar';

const Brand = () => (
  <span className="flex items-center gap-2">
    <span className="h-8 w-8 rounded-md bg-primary-600" aria-hidden="true" />
    <span className="text-h3 text-fg">Lorem ipsum</span>
  </span>
);

const meta: Meta<typeof TopBar> = {
  title: 'Components/TopBar',
  component: TopBar,
};
export default meta;
type Story = StoryObj<typeof TopBar>;

/** Variant: desktop, mobile (state: default). */
export const Variants: Story = {
  render: () => (
    <Stack>
      <Row title="Variant=desktop">
        <TopBar
          className="w-full"
          title={<Brand />}
          search={<SearchField label="Lorem" scope="global" className="w-96" />}
          actions={
            <>
              <IconButton icon="bell" label="foo" />
              <Avatar name="Lorem Ipsum" />
            </>
          }
        />
      </Row>
      <Row title="Variant=mobile">
        <TopBar
          variant="mobile"
          className="w-96"
          title={<Brand />}
          onMenuClick={() => {}}
          actions={
            <>
              <IconButton icon="bell" label="foo" />
              <Avatar name="Lorem Ipsum" size="S" />
            </>
          }
        />
      </Row>
    </Stack>
  ),
};
