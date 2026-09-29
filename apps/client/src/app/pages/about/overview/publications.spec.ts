import {
  PUBLICATIONS,
  PUBLICATION_GROUPS,
  formatIeeeReference
} from './publications';

describe('PUBLICATIONS', () => {
  it('lists all twelve papers', () => {
    expect(PUBLICATIONS).toHaveLength(12);
  });

  it('gives every paper a unique title and a venue', () => {
    const titles = PUBLICATIONS.map(({ title }) => title);

    expect(new Set(titles).size).toBe(titles.length);
    PUBLICATIONS.forEach(({ venue }) =>
      expect(venue.length).toBeGreaterThan(3)
    );
  });

  it('places every paper in exactly one status group', () => {
    const grouped = PUBLICATION_GROUPS.flatMap(({ statuses }) => statuses);

    expect(new Set(grouped).size).toBe(grouped.length);
    PUBLICATIONS.forEach(({ status }) => expect(grouped).toContain(status));
  });

  it('marks the author as corresponding author on every paper', () => {
    PUBLICATIONS.forEach(({ authors }) => expect(authors).toContain('*'));
  });

  it('avoids the em dash', () => {
    JSON.stringify(PUBLICATIONS)
      .split('')
      .forEach((character) => expect(character).not.toBe('—'));
  });
});

describe('formatIeeeReference', () => {
  it('formats a published article with volume, pages and DOI', () => {
    const text = formatIeeeReference({
      authors: 'A. B. Author*',
      details: 'vol. 1, pp. 1-9, 2026, doi: 10.1/x',
      id: 'x',
      status: 'PUBLISHED',
      statusLabel: 'Đã công bố',
      title: 'A sample title',
      venue: 'Journal of Tests'
    });

    expect(text).toBe(
      'A. B. Author*, "A sample title," Journal of Tests, vol. 1, pp. 1-9, 2026, doi: 10.1/x.'
    );
  });

  it('formats a paper without details', () => {
    const text = formatIeeeReference({
      authors: 'A. B. Author*',
      id: 'y',
      status: 'UNDER_REVIEW',
      statusLabel: 'Đang phản biện',
      title: 'Another title',
      venue: 'Journal of Tests'
    });

    expect(text).toBe('A. B. Author*, "Another title," Journal of Tests.');
  });
});
