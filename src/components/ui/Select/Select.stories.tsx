import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { Select, type SelectOption } from './Select';

const OPTIONS: SelectOption[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet'].map((label, i) => ({
  value: `o${i + 1}`,
  label,
  disabled: i === 3,
}));

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: { label: 'Lorem', options: OPTIONS },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Playground: Story = { render: (args) => <Select {...args} className="w-72" /> };

/** Multi: off, on × default, focus, error, disabled. The open state has its own stories. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {[false, true].map((multi) => {
        const value = multi ? { multi: true as const, defaultValue: ['o1', 'o2'] } : {};
        return (
          <Row key={String(multi)} title={`Multi=${multi ? 'on' : 'off'}`}>
            <Demo label="default">
              <Select label="Lorem" options={OPTIONS} {...value} className="w-72" />
            </Demo>
            <Demo label="focus" state="focus">
              <Select label="Lorem" options={OPTIONS} {...value} className="w-72" />
            </Demo>
            <Demo label="error">
              <Select
                label="Lorem"
                options={OPTIONS}
                {...value}
                error="Lorem ipsum dolor"
                className="w-72"
              />
            </Demo>
            <Demo label="disabled">
              <Select label="Lorem" options={OPTIONS} {...value} disabled className="w-72" />
            </Demo>
          </Row>
        );
      })}
    </Stack>
  ),
};

/** Multi=off, State=open. */
export const OpenSingle: Story = {
  name: 'Multi=off, State=open',
  render: () => (
    <div className="h-64">
      <Select label="Lorem" options={OPTIONS} defaultValue="o1" defaultOpen className="w-72" />
    </div>
  ),
};

/** Multi=on, State=open. */
export const OpenMulti: Story = {
  name: 'Multi=on, State=open',
  render: () => (
    <div className="h-64">
      <Select
        multi
        label="Lorem"
        options={OPTIONS}
        defaultValue={['o1', 'o2']}
        defaultOpen
        className="w-72"
      />
    </div>
  ),
};
