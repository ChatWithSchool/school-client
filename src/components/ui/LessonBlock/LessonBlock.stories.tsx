import type { Meta, StoryObj } from '@storybook/react-vite';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { LessonBlock, type LessonState, type LessonTone } from './LessonBlock';

const meta: Meta<typeof LessonBlock> = {
  title: 'Components/LessonBlock',
  component: LessonBlock,
  args: { subject: 'Lorem', meta: 'Ipsum · 4', tone: 'c1', state: 'normal' },
};
export default meta;
type Story = StoryObj<typeof LessonBlock>;

export const Playground: Story = {};

const TONES: LessonTone[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
const STATES: LessonState[] = ['normal', 'substitute', 'cancelled', 'conflict'];

/** Tone c1-c6 × State (default). */
export const Variants: Story = {
  render: () => (
    <Stack>
      {TONES.map((tone) => (
        <Row key={tone} title={`Tone=${tone}`}>
          {STATES.map((state) => (
            <Demo key={state} label={state}>
              <LessonBlock subject="Lorem" meta="Ipsum · 4" tone={tone} state={state} />
            </Demo>
          ))}
        </Row>
      ))}
    </Stack>
  ),
};

/** default, hover, selected (and the keyboard focus). */
export const States: Story = {
  parameters: pseudoStates,
  render: () => (
    <Row title="Tone=c1, State=normal">
      <Demo label="default">
        <LessonBlock subject="Lorem" meta="Ipsum · 4" />
      </Demo>
      <Demo label="hover" state="hover">
        <LessonBlock subject="Lorem" meta="Ipsum · 4" />
      </Demo>
      <Demo label="selected">
        <LessonBlock subject="Lorem" meta="Ipsum · 4" selected />
      </Demo>
      <Demo label="focus" state="focus">
        <LessonBlock subject="Lorem" meta="Ipsum · 4" />
      </Demo>
    </Row>
  ),
};
