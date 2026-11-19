// src/screens/I01-institution-structure/index.test.tsx
import { renderWithProviders } from '../../test/utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Screen from './index';

type User = ReturnType<typeof userEvent.setup>;

async function fillValidForm(user: User) {
  await user.type(screen.getByRole('textbox', { name: /שם המוסד/ }), 'תל-אביב');

  await user.click(screen.getByRole('combobox', { name: /סוג מוסד/ }));
  await user.click(screen.getByRole('option', { name: 'בית ספר יסודי' }));

  await user.click(screen.getByRole('combobox', { name: /שכבות לימוד/ }));
  await user.click(screen.getByRole('checkbox', { name: 'יסודי' }));
  await user.keyboard('{Escape}');

  await user.click(screen.getByRole('combobox', { name: /שנת לימודים נוכחית/ }));
  await user.click(screen.getByRole('option', { name: 'תשפ"ז' }));
}

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

  it('shows the save-and-exit action on the first step', () => {
    renderWithProviders(<Screen />);

    expect(screen.getByRole('button', { name: /שמור וצא/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /חזרה/ })).not.toBeInTheDocument();
  });

  it('shows validation errors when continuing with empty required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Screen />);

    await user.click(screen.getByRole('button', { name: /המשך/ }));

    expect(screen.getAllByText('שדה חובה').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('heading', { name: /אשף הקמת מוסד: מבנה בית הספר/ }),
    ).toBeInTheDocument();
  });

  it('reduces the number of required-field errors after one field is filled', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Screen />);

    await user.click(screen.getByRole('button', { name: /המשך/ }));
    expect(screen.getAllByText('שדה חובה')).toHaveLength(4);

    await user.type(screen.getByRole('textbox', { name: /שם המוסד/ }), 'תל-אביב');

    expect(screen.getAllByText('שדה חובה')).toHaveLength(3);
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

  it('moves to the confirmation step with a summary when the form is valid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Screen />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /המשך/ }));

    expect(screen.getByRole('heading', { name: /אשף הקמת מוסד: אישור/ })).toBeInTheDocument();
    expect(screen.getByText('תל-אביב')).toBeInTheDocument();
    expect(screen.getByText('בית ספר יסודי')).toBeInTheDocument();
    expect(screen.getByText('תשפ"ז')).toBeInTheDocument();
    expect(screen.getByText('א, ב')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'אישור' })).toBeInTheDocument();
  });

  it('returns to the form with the entered values when pressing back', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Screen />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /המשך/ }));
    await user.click(screen.getByRole('button', { name: /חזרה/ }));

    expect(
      screen.getByRole('heading', { name: /אשף הקמת מוסד: מבנה בית הספר/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /שם המוסד/ })).toHaveValue('תל-אביב');
  });

  it('shows a success message after confirming', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(<Screen onConfirm={onConfirm} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /המשך/ }));
    await user.click(screen.getByRole('button', { name: 'אישור' }));

    expect(await screen.findByText('המוסד נוצר בהצלחה.')).toBeInTheDocument();
    expect(onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ schoolName: 'תל-אביב', institutionType: 'elementary' }),
    );
  });

  it('shows an error and allows retry when saving fails', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockRejectedValue(new Error('fail'));
    renderWithProviders(<Screen onConfirm={onConfirm} />);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: /המשך/ }));
    await user.click(screen.getByRole('button', { name: 'אישור' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('אירעה שגיאה בשמירה');
    expect(screen.getByRole('button', { name: 'אישור' })).toBeEnabled();
  });

  it('uses the signed-in user permissions instead of a hardcoded allow-all default', async () => {
    renderWithProviders(<Screen />, { token: 'mock.or.barak@school.example' });

    expect(await screen.findByRole('alert')).toHaveTextContent('אין לך הרשאה');
    expect(screen.queryByRole('textbox', { name: /שם המוסד/ })).not.toBeInTheDocument();
  });

  it('shows a no-permission message and no form for users without permission', () => {
    renderWithProviders(<Screen canManage={false} />);

    expect(screen.getByRole('alert')).toHaveTextContent('אין לך הרשאה');
    expect(screen.queryByRole('textbox', { name: /שם המוסד/ })).not.toBeInTheDocument();
  });
});

