import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { IconButton, type IconButtonSize, type IconButtonVariant } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { icon: 'pencil', label: 'Lorem', variant: 'ghost', size: 'M' },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

const VARIANTS: IconButtonVariant[] = ['ghost', 'secondary'];
const SIZES: IconButtonSize[] = ['S', 'M'];

export const Playground: Story = {};

/** Variant × Size, then default, hover, pressed, focus, disabled. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {VARIANTS.map((variant) =>
        SIZES.map((size) => (
          <Row key={variant + size} title={`Variant=${variant}, Size=${size}`}>
            <Demo label="default">
              <IconButton variant={variant} size={size} icon="pencil" label="foo" />
            </Demo>
            <Demo label="hover" state="hover">
              <IconButton variant={variant} size={size} icon="pencil" label="foo" />
            </Demo>
            <Demo label="pressed" state="pressed">
              <IconButton variant={variant} size={size} icon="pencil" label="foo" />
            </Demo>
            <Demo label="focus" state="focus">
              <IconButton variant={variant} size={size} icon="pencil" label="foo" />
            </Demo>
            <Demo label="disabled">
              <IconButton variant={variant} size={size} icon="pencil" label="foo" disabled />
            </Demo>
          </Row>
        )),
      )}
    </Stack>
  ),
};
