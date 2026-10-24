import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileDropzone } from './FileDropzone';

const file = new File(['foo'], 'foo.csv', { type: 'text/csv' });

describe('FileDropzone', () => {
  it('idle: a named group with a button that chooses a file', async () => {
    const onFiles = vi.fn();
    const { container } = render(<FileDropzone onFiles={onFiles} accept=".csv" />);
    expect(screen.getByRole('group', { name: 'העלאת קובץ' })).toBeInTheDocument();
    expect(screen.getByText('CSV או Excel, עד 5MB')).toBeInTheDocument();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('accept', '.csv');
    await userEvent.upload(input, file);
    expect(onFiles).toHaveBeenCalledWith([file]);
    expect(screen.getByRole('button', { name: 'בחרו קובץ' })).toBeInTheDocument();
  });

  it('drag-over highlights the zone and a drop gives the file', () => {
    const onFiles = vi.fn();
    render(<FileDropzone onFiles={onFiles} />);
    const zone = screen.getByRole('group');
    fireEvent.dragOver(zone);
    expect(zone).toHaveClass('bg-primary-50');
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
    expect(zone).not.toHaveClass('bg-primary-50');
  });

  it('uploading shows the file and the progress', () => {
    render(<FileDropzone onFiles={() => {}} state="uploading" fileName="foo.csv" progress={60} />);
    expect(screen.getByRole('group')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60');
    expect(screen.getByText('foo.csv')).toBeInTheDocument();
  });

  it('error announces the message; done says the file was uploaded', () => {
    const { rerender } = render(<FileDropzone onFiles={() => {}} state="error" error="bar" />);
    expect(screen.getByRole('alert')).toHaveTextContent('bar');
    expect(screen.getByRole('button', { name: 'בחירת קובץ אחר' })).toBeInTheDocument();
    rerender(<FileDropzone onFiles={() => {}} state="done" fileName="foo.csv" />);
    expect(screen.getByRole('status')).toHaveTextContent('foo.csv הועלה');
    expect(screen.getByRole('button', { name: 'החלפת קובץ' })).toBeInTheDocument();
  });
});
