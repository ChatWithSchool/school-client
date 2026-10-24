import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { TextArea } from '../TextArea/TextArea';
import { TextField } from '../TextField/TextField';
import { DialogClose, Drawer } from './Drawer';

const Body = () => (
  <>
    <TextField label="Lorem" placeholder="Ipsum" />
    <TextArea label="Dolor" placeholder="Sit amet" rows={5} />
  </>
);

/** The primary button first: in RTL it is the rightmost of the group. */
const Footer = () => (
  <>
    <Button>Lorem</Button>
    <DialogClose asChild>
      <Button variant="secondary">Ipsum</Button>
    </DialogClose>
  </>
);

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  args: {
    title: 'Lorem ipsum',
    trigger: <Button>Lorem</Button>,
    children: <Body />,
    footer: <Footer />,
  },
};
export default meta;
type Story = StoryObj<typeof Drawer>;

export const Playground: Story = {};

/** Side: end × Width: 420, state: open. */
export const Open: Story = {
  name: 'Side=end, Width=420 (open)',
  args: { open: true, trigger: undefined },
};
