import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { SearchField, type SearchFieldProps, type SearchResult } from './SearchField';

const ALL: SearchResult[] = ['Lorem ipsum', 'Lorem dolor', 'Lorem sit amet'].map((label, i) => ({
  id: String(i),
  label,
}));

const meta: Meta<typeof SearchField> = {
  title: 'Components/SearchField',
  component: SearchField,
  args: { label: 'Lorem', scope: 'local' },
};
export default meta;
type Story = StoryObj<typeof SearchField>;

function Live(args: SearchFieldProps) {
  const [text, setText] = useState('');
  const results = ALL.filter((r) => r.label.toLowerCase().includes(text.toLowerCase()));
  return (
    <SearchField
      {...args}
      className="w-72"
      value={text}
      onChange={(e) => setText(e.target.value)}
      results={results}
    />
  );
}

/** Type "lorem" to see results, anything else for no results. */
export const Playground: Story = { render: (args) => <Live {...args} /> };

/** The results panel opens on focus with typed text. autoFocus shows one open panel at a time. */
function Open({ scope, results }: { scope: 'local' | 'global'; results: SearchResult[] }) {
  return (
    <SearchField
      label="Lorem"
      scope={scope}
      defaultValue="foo"
      results={results}
      autoFocus
      className={scope === 'global' ? 'w-96' : 'w-72'}
    />
  );
}

/** Scope: local, global × default, focus, with-results, no-results. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {(['local', 'global'] as const).map((scope) => (
        <Row key={scope} title={`Scope=${scope}`}>
          <Demo label="default">
            <SearchField label="Lorem" scope={scope} className="w-72" />
          </Demo>
          <Demo label="focus" state="focus">
            <SearchField label="Lorem" scope={scope} className="w-72" />
          </Demo>
        </Row>
      ))}
    </Stack>
  ),
};

export const WithResults: Story = {
  render: () => (
    <div className="h-48">
      <Open scope="local" results={ALL} />
    </div>
  ),
};

export const NoResults: Story = {
  render: () => (
    <div className="h-48">
      <Open scope="global" results={[]} />
    </div>
  ),
};
