import * as RadixToast from '@radix-ui/react-toast';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import type { ToastTone } from '../internal/toastContext';
import { Demo, Row, Stack } from '../internal/story';
import { Toast, ToastProvider } from './Toast';
import { useToast } from './useToast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
};
export default meta;
type Story = StoryObj<typeof Toast>;

const TONES: ToastTone[] = ['success', 'danger', 'info'];

function Buttons() {
  const toast = useToast();
  return (
    <div className="flex gap-2">
      {TONES.map((tone) => (
        <Button key={tone} variant="secondary" onClick={() => toast({ tone, message: 'Lorem' })}>
          {tone}
        </Button>
      ))}
      <Button onClick={() => toast({ message: 'Lorem ipsum', onUndo: () => {} })}>undo</Button>
    </div>
  );
}

/** States enter, visible and exit: each button shows a toast that enters, stays 5 s and exits. */
export const Playground: Story = {
  render: () => (
    <ToastProvider>
      <Buttons />
    </ToastProvider>
  ),
};

/** Tone × Action (state: visible). The toasts are laid out in place, not in the corner. */
export const Variants: Story = {
  render: () => (
    <RadixToast.Provider duration={Infinity}>
      <Stack>
        {(['none', 'undo'] as const).map((action) => (
          <Row key={action} title={`Action=${action}`}>
            {TONES.map((tone) => (
              <Demo key={tone} label={tone}>
                <ol>
                  <Toast tone={tone} action={action} message="Lorem ipsum dolor" open />
                </ol>
              </Demo>
            ))}
          </Row>
        ))}
      </Stack>
      <RadixToast.Viewport />
    </RadixToast.Provider>
  ),
};
