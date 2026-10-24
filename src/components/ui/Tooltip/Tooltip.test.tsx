import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/utils';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('opens on keyboard focus and closes with Escape', async () => {
    renderWithProviders(
      <Tooltip content="foo">
        <IconButton icon="info" label="bar" />
      </Tooltip>,
    );
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'bar' })).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('foo');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('maps start to the right side in RTL', async () => {
    // renderWithProviders sets the RTL direction, as App.tsx does
    renderWithProviders(
      // jsdom has no layout: without avoidCollisions the popper flips the side
      <Tooltip content="foo" placement="start" defaultOpen avoidCollisions={false}>
        <IconButton icon="info" label="bar" />
      </Tooltip>,
    );
    await screen.findByRole('tooltip');
    expect(document.querySelector('[data-side]')).toHaveAttribute('data-side', 'right');
  });
});
