import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '../Checkbox/Checkbox';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { TableRow } from './TableRow';

const meta: Meta<typeof TableRow> = {
  title: 'Components/Table/TableRow',
  component: TableRow,
};
export default meta;
type Story = StoryObj<typeof TableRow>;

function One({ selected, density }: { selected?: boolean; density: 'comfortable' | 'compact' }) {
  return (
    <table className="w-96 border border-line">
      <tbody>
        <TableRow selected={selected} density={density} tabIndex={0}>
          <td className="w-10 px-3">
            <Checkbox aria-label="foo" checked={selected} />
          </td>
          <td className="px-3 text-body-strong">Lorem ipsum</td>
          <td className="px-3 text-fg-secondary">Dolor</td>
        </TableRow>
      </tbody>
    </table>
  );
}

/** Selected: off, on × default, hover, selected, focus, in both densities. */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {(['comfortable', 'compact'] as const).map((density) => (
        <Row key={density} title={`Density=${density}`}>
          <Demo label="default">
            <One density={density} />
          </Demo>
          <Demo label="hover" state="hover">
            <One density={density} />
          </Demo>
          <Demo label="selected">
            <One density={density} selected />
          </Demo>
          <Demo label="focus" state="focus">
            <One density={density} />
          </Demo>
        </Row>
      ))}
    </Stack>
  ),
};
