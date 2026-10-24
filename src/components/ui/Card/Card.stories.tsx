import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
};
export default meta;
type Story = StoryObj<typeof Card>;

const Body = () => (
  <>
    <p className="text-body-strong">Lorem ipsum</p>
    <p className="text-body text-fg-secondary">Dolor sit amet, consectetur adipiscing.</p>
  </>
);

/** Padding × Interactive, then default, hover, focus of an interactive card. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      <Row title="Interactive=off">
        <Demo label="Padding=M">
          <Card padding="M" className="w-64">
            <Body />
          </Card>
        </Demo>
        <Demo label="Padding=L">
          <Card padding="L" className="w-64">
            <Body />
          </Card>
        </Demo>
      </Row>
      <Row title="Interactive=on (Padding=L)">
        <Demo label="default">
          <Card interactive className="w-64">
            <Body />
          </Card>
        </Demo>
        <Demo label="hover" state="hover">
          <Card interactive className="w-64">
            <Body />
          </Card>
        </Demo>
        <Demo label="focus" state="focus">
          <Card interactive className="w-64">
            <Body />
          </Card>
        </Demo>
        <Demo label="Padding=M">
          <Card interactive padding="M" className="w-64">
            <Body />
          </Card>
        </Demo>
      </Row>
    </Stack>
  ),
};
