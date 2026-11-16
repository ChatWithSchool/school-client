import type { ComponentProps } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TooltipProvider } from '../../components/ui/Tooltip/Tooltip';
import Screen from './index';

function renderScreen(props: ComponentProps<typeof Screen> = {}) {
  return render(
    <TooltipProvider>
      <Screen {...props} />
    </TooltipProvider>,
  );
}

describe('G01 grades entry screen', () => {
  it('renders the grade entry header and updates the class average immediately', async () => {
    renderScreen();

    expect(screen.getByRole('heading', { name: 'הזנת ציונים ומשוב' })).toBeInTheDocument();
    expect(screen.getByText('ממוצע כיתתי')).toBeInTheDocument();

    const averageNode = screen.getByTestId('average-metric');
    await screen.findByText('81.2');
    expect(averageNode).toHaveTextContent('81.2');

    const gradeInput = await screen.findByRole('textbox', { name: 'ציון עבור אורי כהן' });
    await userEvent.clear(gradeInput);
    await userEvent.type(gradeInput, '95');

    expect(averageNode).toHaveTextContent('83.4');
    expect(screen.getByRole('textbox', { name: 'הערה לתלמיד אורי כהן' })).toBeInTheDocument();
  });

  it('keeps an out-of-range draft visible, marks the cell invalid, and excludes it from the average', async () => {
    renderScreen();

    const averageNode = screen.getByTestId('average-metric');
    const gradeInput = await screen.findByRole('textbox', { name: 'ציון עבור שירה דוד' });
    fireEvent.change(gradeInput, { target: { value: '101' } });

    expect(gradeInput).toHaveValue('101');
    expect(gradeInput).toHaveAttribute('aria-invalid', 'true');
    expect(averageNode).toHaveTextContent('81.2');
  });

  it('uses the shared loading, empty, and retryable error states', async () => {
    const neverLoaded = new Promise<never[]>(() => {});
    const loading = renderScreen({ loadRows: () => neverLoaded });
    expect(screen.getByRole('status', { name: 'טוען' })).toBeInTheDocument();
    loading.unmount();

    renderScreen({ loadRows: async () => [] });
    expect(await screen.findByText('אין תלמידים להצגה')).toBeInTheDocument();
  });

  it('shows a retryable load error and retries the mock request', async () => {
    const loadRows = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([]);
    renderScreen({ loadRows });

    expect(await screen.findByRole('alert')).toHaveTextContent('אירעה שגיאה, נסי שוב');
    await userEvent.click(screen.getByRole('button', { name: 'נסי שוב' }));

    expect(await screen.findByText('אין תלמידים להצגה')).toBeInTheDocument();
    expect(loadRows).toHaveBeenCalledTimes(2);
  });

  it('marks a failed save and retries it from the grade cell', async () => {
    const saveGrade = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(undefined);
    renderScreen({ saveGrade });

    const gradeInput = await screen.findByRole('textbox', { name: 'ציון עבור שירה דוד' });
    await userEvent.type(gradeInput, '95');

    const retry = await screen.findByRole('button', { name: 'נסי שוב' });
    expect(gradeInput).toHaveAttribute('aria-invalid', 'true');
    await userEvent.click(retry);

    await waitFor(() => expect(saveGrade).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'נסי שוב' })).not.toBeInTheDocument(),
    );
    expect(gradeInput).not.toHaveAttribute('aria-invalid');
  });
});
