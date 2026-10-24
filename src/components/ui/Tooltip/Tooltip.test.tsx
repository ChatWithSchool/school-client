import { DirectionProvider } from '@radix-ui/react-direction';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('opens on keyboard focus and closes with Escape', async () => {
    render(
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
    render(
      <DirectionProvider dir="rtl">
        {/* jsdom has no layout: without this the popper flips the side */}
        <Tooltip content="foo" placement="start" defaultOpen avoidCollisions={false}>
          <IconButton icon="info" label="bar" />
        </Tooltip>
      </DirectionProvider>,
    );
    await screen.findByRole('tooltip');
    expect(document.querySelector('[data-side]')).toHaveAttribute('data-side', 'right');
  });
});
