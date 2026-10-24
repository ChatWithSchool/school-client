import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Demo, Row, Stack } from '../internal/story';
import { pseudoStates } from '../internal/storyStates';
import { Pagination, type PaginationProps } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { page: 1, pageCount: 10, variant: 'full' },
};
export default meta;
type Story = StoryObj<typeof Pagination>;

function Live(args: PaginationProps) {
  const [page, setPage] = useState(args.page);
  return <Pagination {...args} page={page} onPageChange={setPage} />;
}

export const Playground: Story = { render: (args) => <Live {...args} /> };

/** Variant: full, compact. States: default, current, disabled (the arrows at the edges). */
export const VariantsAndStates: Story = {
  parameters: pseudoStates,
  render: () => (
    <Stack>
      {(['full', 'compact'] as const).map((variant) => (
        <Row key={variant} title={`Variant=${variant}`}>
          <Demo label="first page (previous disabled)">
            <Pagination variant={variant} page={1} pageCount={10} onPageChange={() => {}} />
          </Demo>
          <Demo label="middle">
            <Pagination variant={variant} page={5} pageCount={10} onPageChange={() => {}} />
          </Demo>
          <Demo label="last page (next disabled)">
            <Pagination variant={variant} page={10} pageCount={10} onPageChange={() => {}} />
          </Demo>
          <Demo label="hover" state="hover">
            <Pagination variant={variant} page={5} pageCount={10} onPageChange={() => {}} />
          </Demo>
          <Demo label="focus" state="focus">
            <Pagination variant={variant} page={5} pageCount={10} onPageChange={() => {}} />
          </Demo>
        </Row>
      ))}
    </Stack>
  ),
};
