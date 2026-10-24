import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { RadioGroup } from './RadioGroup';

const OPTIONS = [
  { value: 'foo', label: 'Lorem' },
  { value: 'bar', label: 'Ipsum' },
  { value: 'baz', label: 'Dolor' },
];

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  args: { label: 'Lorem ipsum', options: OPTIONS, defaultValue: 'foo' },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Playground: Story = {};

/** Orientation: vertical, horizontal × default, focus, disabled. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {(['vertical', 'horizontal'] as const).map((orientation) => (
        <Row key={orientation} title={`Orientation=${orientation}`}>
          <Demo label="default">
            <RadioGroup
              label="Lorem"
              options={OPTIONS}
              defaultValue="foo"
              orientation={orientation}
            />
          </Demo>
          <Demo label="focus" state="focus">
            <RadioGroup
              label="Lorem"
              options={OPTIONS}
              defaultValue="foo"
              orientation={orientation}
            />
          </Demo>
          <Demo label="disabled">
            <RadioGroup
              label="Lorem"
              options={OPTIONS}
              defaultValue="foo"
              orientation={orientation}
              disabled
            />
          </Demo>
        </Row>
      ))}
    </Stack>
  ),
};
