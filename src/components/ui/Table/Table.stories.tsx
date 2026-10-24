import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../Badge/Badge';
import { IconButton } from '../IconButton/IconButton';
import { Row, Stack } from '../internal/story';
import { Table, type TableColumn } from './Table';

type Item = { id: string; name: string; text: string; num: number };
const ITEMS: Item[] = ['Lorem', 'Ipsum', 'Dolor'].map((name, i) => ({
  id: String(i + 1),
  name,
  text: 'Sit amet',
  num: 1234 + i,
}));

const COLUMNS: TableColumn<Item>[] = [
  { key: 'name', header: 'Lorem', cell: (r) => <span className="text-body-strong">{r.name}</span> },
  {
    key: 'text',
    header: 'Ipsum',
    cell: (r) => <span className="text-fg-secondary">{r.text}</span>,
  },
  { key: 'num', header: 'Dolor', cell: (r) => r.num, numeric: true },
  {
    key: 'status',
    header: 'Sit',
    cell: () => (
      <Badge tone="success" size="S">
        Amet
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: '',
    className: 'w-10',
    cell: () => <IconButton icon="ellipsis-vertical" label="foo" size="S" />,
  },
];

const meta: Meta = { title: 'Components/Table' };
export default meta;
type Story = StoryObj;

function Selectable({ density }: { density: 'comfortable' | 'compact' }) {
  const [ids, setIds] = useState<string[]>(['2']);
  return (
    <Table
      caption="Lorem"
      columns={COLUMNS}
      rows={ITEMS}
      getRowId={(r) => r.id}
      density={density}
      selectable
      selectedIds={ids}
      onSelectedChange={setIds}
    />
  );
}

/** Density × Selectable × State: populated, loading, empty. The header is sticky. */
export const VariantsAndStates: Story = {
  render: () => (
    <Stack>
      {(['comfortable', 'compact'] as const).map((density) => (
        <Stack key={density}>
          <Row title={`Density=${density}, Selectable=off, State=populated`}>
            <Table
              caption="Lorem"
              columns={COLUMNS}
              rows={ITEMS}
              getRowId={(r) => r.id}
              density={density}
              wrapperClassName="w-full"
            />
          </Row>
          <Row title={`Density=${density}, Selectable=on, State=populated`}>
            <div className="w-full">
              <Selectable density={density} />
            </div>
          </Row>
          <Row title={`Density=${density}, State=loading`}>
            <Table
              caption="Lorem"
              columns={COLUMNS}
              rows={undefined}
              getRowId={(r) => r.id}
              density={density}
              wrapperClassName="w-full"
            />
          </Row>
          <Row title={`Density=${density}, State=empty`}>
            <Table
              caption="Lorem"
              columns={COLUMNS}
              rows={[]}
              getRowId={(r) => r.id}
              density={density}
              wrapperClassName="w-full"
            />
          </Row>
        </Stack>
      ))}
      <Row title="Sticky header (scroll inside the box)">
        <Table
          caption="Lorem"
          columns={COLUMNS}
          rows={[...ITEMS, ...ITEMS, ...ITEMS].map((r, i) => ({ ...r, id: String(i) }))}
          getRowId={(r) => r.id}
          wrapperClassName="h-48 w-full"
        />
      </Row>
    </Stack>
  ),
};
