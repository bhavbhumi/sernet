import { describe, it, expect } from 'vitest';
import { parseCSV } from './BulkImportDialog';
describe('contact CSV import parsing', () => {
  it('keeps each value in its own column', () => {
    expect(parseCSV('full_name,phone,email,city\nZZ One,9000000001,a@b.com,Mumbai')[0]).toEqual({ full_name: 'ZZ One', phone: '9000000001', email: 'a@b.com', city: 'Mumbai' });
  });
  it('keeps blank fields blank instead of shifting later columns', () => {
    expect(parseCSV('full_name,phone,email,city\nZZ Two,9000000002,,Pune')[0]).toMatchObject({ email: '', city: 'Pune' });
  });
  it('handles quoted commas', () => {
    expect(parseCSV('full_name,city\n"Patel, Sons",Surat')[0]).toEqual({ full_name: 'Patel, Sons', city: 'Surat' });
  });
});
