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

  it('checks dropped and chosen files against accept and rejects the others', async () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const pdf = new File(['bar'], 'bar.pdf', { type: 'application/pdf' });
    const txt = new File(['baz'], 'baz.txt', { type: 'text/plain' });
    const { container, rerender } = render(
      <FileDropzone onFiles={onFiles} onReject={onReject} accept=".csv" multiple />,
    );
    fireEvent.drop(screen.getByRole('group'), { dataTransfer: { files: [file, pdf] } });
    expect(onFiles).toHaveBeenLastCalledWith([file]);
    expect(onReject).toHaveBeenLastCalledWith([pdf]);

    rerender(<FileDropzone onFiles={onFiles} onReject={onReject} accept="text/*" multiple />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    // applyAccept: false lets the test give a file the input's accept would hide
    await userEvent.upload(input, [txt, pdf], { applyAccept: false });
    expect(onFiles).toHaveBeenLastCalledWith([txt]);
    expect(onReject).toHaveBeenLastCalledWith([pdf]);
  });

  it('ignores drops while uploading or done, and takes them in the error state', () => {
    const onFiles = vi.fn();
    const { rerender } = render(<FileDropzone onFiles={onFiles} state="uploading" />);
    fireEvent.drop(screen.getByRole('group'), { dataTransfer: { files: [file] } });
    rerender(<FileDropzone onFiles={onFiles} state="done" />);
    fireEvent.drop(screen.getByRole('group'), { dataTransfer: { files: [file] } });
    expect(onFiles).not.toHaveBeenCalled();
    rerender(<FileDropzone onFiles={onFiles} state="error" />);
    fireEvent.drop(screen.getByRole('group'), { dataTransfer: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('dragging over a child of the zone keeps the highlight', () => {
    render(<FileDropzone onFiles={() => {}} />);
    const zone = screen.getByRole('group');
    const child = screen.getByRole('button', { name: 'בחרו קובץ' });
    // jsdom has no DragEvent; a MouseEvent carries the relatedTarget
    const leave = (relatedTarget: Element | null) =>
      fireEvent(zone, new MouseEvent('dragleave', { bubbles: true, relatedTarget }));
    fireEvent.dragOver(zone);
    leave(child);
    expect(zone).toHaveClass('bg-primary-50');
    leave(null);
    expect(zone).not.toHaveClass('bg-primary-50');
  });
});
