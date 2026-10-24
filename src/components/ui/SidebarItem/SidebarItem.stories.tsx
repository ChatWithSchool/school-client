import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { SidebarItem } from './SidebarItem';

const meta: Meta<typeof SidebarItem> = {
  title: 'Components/SidebarItem',
  component: SidebarItem,
  args: { to: '/foo', icon: 'home', label: 'Lorem ipsum' },
};
export default meta;
type Story = StoryObj<typeof SidebarItem>;

export const Playground: Story = {};

/** State: default, hover, active, collapsed × Badge: off, on; and focus. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {(['off', 'on'] as const).map((b) => {
        const badge = b === 'on' ? 3 : undefined;
        return (
          <Row key={b} title={`Badge=${b}`}>
            <Demo label="default">
              <SidebarItem
                to="/foo"
                icon="home"
                label="Lorem ipsum"
                badge={badge}
                className="w-56"
              />
            </Demo>
            <Demo label="hover" state="hover">
              <SidebarItem
                to="/foo"
                icon="home"
                label="Lorem ipsum"
                badge={badge}
                className="w-56"
              />
            </Demo>
            <Demo label="active">
              <SidebarItem
                to="/foo"
                icon="home"
                label="Lorem ipsum"
                badge={badge}
                active
                className="w-56"
              />
            </Demo>
            <Demo label="focus" state="focus">
              <SidebarItem
                to="/foo"
                icon="home"
                label="Lorem ipsum"
                badge={badge}
                className="w-56"
              />
            </Demo>
            <Demo label="collapsed">
              <SidebarItem to="/foo" icon="home" label="Lorem ipsum" badge={badge} collapsed />
            </Demo>
          </Row>
        );
      })}
    </Stack>
  ),
};
