import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { describe, expect, it } from 'vitest';
import { LegalDocument } from './LegalDocument';

describe('LegalDocument', () => {
  it('preserves explicit section anchors after duplicate sections are removed', () => {
    render(<LegalDocument body='<h2 id="legal-section-9">Information Technology Policy</h2><h2 id="legal-section-10">HR Policy — Sales &amp; Operations</h2>' />);
    expect(screen.getByRole('link', { name: 'Information Technology Policy' })).toHaveAttribute('href', '#legal-section-9');
    expect(screen.getByRole('link', { name: 'HR Policy — Sales & Operations' })).toHaveAttribute('href', '#legal-section-10');
  });

  it('groups policy navigation while preserving existing numbered anchors', () => {
    render(<LegalDocument body='<h2 data-policy-group="Investor Services">KYC Policy</h2><h2 data-policy-group="Investor Services">Transactions</h2><h2 data-policy-group="People & Governance">HR Policy</h2>' />);
    expect(screen.getByText('Investor Services')).toBeInTheDocument();
    expect(screen.getByText('People & Governance')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'HR Policy' })).toHaveAttribute('href', '#legal-section-3');
  });

  it('builds unique working section anchors from CMS headings', () => {
    render(<LegalDocument body="<h2>Overview</h2><p>Distributor terms.</p><h2>Overview</h2>" />);
    expect(screen.getAllByRole('link', { name: 'Overview' }).map(link => link.getAttribute('href'))).toEqual(['#legal-section-1', '#legal-section-2']);
    expect(screen.getAllByRole('heading', { name: 'Overview' }).map(heading => heading.id)).toEqual(['legal-section-1', 'legal-section-2']);
  });

  it('removes executable HTML but preserves legal text and safe links', () => {
    const { container } = render(<LegalDocument body={'<h2>Privacy</h2><script>alert(1)</script><p onclick="alert(1)">Your information</p><a href="javascript:alert(1)">Bad link</a><a href="/legal?tab=grievances">Complaints</a>'} />);
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('[onclick]')).toBeNull();
    expect(screen.getByText('Bad link')).not.toHaveAttribute('href');
    expect(screen.getByRole('link', { name: 'Complaints' })).toHaveAttribute('href', '/legal?tab=grievances');
  });
});