import { renderWithProviders } from '../../test/utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Screen from './index';

describe('I01 institution structure wizard', () => {
  it('renders the first setup step and key fields', () => {
    renderWithProviders(<Screen />);

    expect(
      screen.getByRole('heading', { name: /אשף הקמת מוסד: מבנה בית הספר/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /המשך/ })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /שם המוסד/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /סוג מוסד/ })).toBeInTheDocument();
  });

  it('shows validation errors when continuing with empty required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Screen />);

    await user.click(screen.getByRole('button', { name: /המשך/ }));

    expect(screen.getAllByText('שדה חובה').length).toBeGreaterThan(0);
  });

  it('updates the preview when the number of classes changes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Screen />);

    await user.click(screen.getByRole('combobox', { name: /שכבות לימוד/ }));
    await user.click(screen.getByRole('checkbox', { name: 'יסודי' }));

    await user.click(screen.getByRole('combobox', { name: /מספר כיתות בכל שכבה/ }));
    await user.click(screen.getByRole('option', { name: '3' }));

    expect(screen.getAllByText('יסודי').length).toBeGreaterThan(0);
    expect(screen.getByText('א, ב, ג')).toBeInTheDocument();
  });
});
