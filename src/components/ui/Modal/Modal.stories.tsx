import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    title: 'Lorem ipsum',
    description: 'Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
    size: 'S',
    footer: 'double',
    trigger: <Button>Lorem</Button>,
  },
};
export default meta;
type Story = StoryObj<typeof Modal>;

/** Click the button: focus moves into the dialog, Escape closes it. */
export const Playground: Story = {};

/** State: open. One story per Size × Footer, so only one dialog is open at a time. */
export const SizeS_FooterSingle: Story = {
  name: 'Size=S, Footer=single',
  args: { open: true, footer: 'single', size: 'S', trigger: undefined },
};

export const SizeS_FooterDouble: Story = {
  name: 'Size=S, Footer=double',
  args: { open: true, footer: 'double', size: 'S', trigger: undefined },
};

export const SizeM_FooterSingle: Story = {
  name: 'Size=M, Footer=single',
  args: { open: true, footer: 'single', size: 'M', trigger: undefined },
};

export const SizeM_FooterDouble: Story = {
  name: 'Size=M, Footer=double',
  args: { open: true, footer: 'double', size: 'M', trigger: undefined },
};

/** A delete confirmation: the danger confirm button. */
export const Danger: Story = {
  args: { open: true, confirmVariant: 'danger', confirmLabel: 'Lorem', trigger: undefined },
};
