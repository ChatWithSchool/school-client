import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { Button, type ButtonSize, type ButtonVariant } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Lorem ipsum', variant: 'primary', size: 'M' },
};
export default meta;
type Story = StoryObj<typeof Button>;

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger'];
const SIZES: ButtonSize[] = ['S', 'M', 'L'];

export const Playground: Story = {};

/** Variant × Size × Icon, in the default state. */
export const Variants: Story = {
  render: () => (
    <Stack>
      {VARIANTS.map((variant) => (
        <Row key={variant} title={`Variant=${variant}`}>
          {SIZES.map((size) => (
            <div key={size} className="flex items-center gap-3">
              <Demo label={`${size} · none`}>
                <Button variant={variant} size={size}>
                  Lorem
                </Button>
              </Demo>
              <Demo label={`${size} · leading`}>
                <Button variant={variant} size={size} icon="leading" iconName="plus">
                  Lorem
                </Button>
              </Demo>
              <Demo label={`${size} · trailing`}>
                <Button variant={variant} size={size} icon="trailing" iconName="chevron-left">
                  Lorem
                </Button>
              </Demo>
              <Demo label={`${size} · icon-only`}>
                <Button
                  variant={variant}
                  size={size}
                  icon="icon-only"
                  iconName="pencil"
                  aria-label="foo"
                />
              </Demo>
            </div>
          ))}
        </Row>
      ))}
    </Stack>
  ),
};

/** default, hover, pressed, focus, disabled, loading. */
export const States: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {VARIANTS.map((variant) => (
        <Row key={variant} title={`Variant=${variant}`}>
          <Demo label="default">
            <Button variant={variant}>Lorem</Button>
          </Demo>
          <Demo label="hover" state="hover">
            <Button variant={variant}>Lorem</Button>
          </Demo>
          <Demo label="pressed" state="pressed">
            <Button variant={variant}>Lorem</Button>
          </Demo>
          <Demo label="focus" state="focus">
            <Button variant={variant}>Lorem</Button>
          </Demo>
          <Demo label="disabled">
            <Button variant={variant} disabled>
              Lorem
            </Button>
          </Demo>
          <Demo label="loading">
            <Button variant={variant} loading>
              Lorem
            </Button>
          </Demo>
        </Row>
      ))}
    </Stack>
  ),
};
