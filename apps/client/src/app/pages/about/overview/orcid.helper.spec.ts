import { ORCID_ID, parseOrcidWorks } from './orcid.helper';

// Shape of https://pub.orcid.org/v3.0/{orcid}/works (public API, JSON)
function work({
  doi,
  journal,
  putCode,
  title,
  url,
  year
}: {
  doi?: string;
  journal?: string;
  putCode: number;
  title: string;
  url?: string;
  year?: string;
}) {
  return {
    'external-ids': {
      'external-id': doi
        ? [
            {
              'external-id-type': 'doi',
              'external-id-url': { value: `https://doi.org/${doi}` },
              'external-id-value': doi
            }
          ]
        : []
    },
    'journal-title': journal ? { value: journal } : null,
    'publication-date': year ? { year: { value: year } } : null,
    'put-code': putCode,
    title: { title: { value: title } },
    url: url ? { value: url } : null
  };
}

describe('parseOrcidWorks', () => {
  it('uses the ORCID iD of the author', () => {
    expect(ORCID_ID).toBe('0009-0008-3307-6569');
  });

  it('maps a work summary to title, journal, year and DOI link', () => {
    const response = {
      group: [
        {
          'work-summary': [
            work({
              doi: '10.1234/abc',
              journal: 'Tạp chí Kinh tế',
              putCode: 1,
              title: 'Bài báo A',
              year: '2026'
            })
          ]
        }
      ]
    };

    expect(parseOrcidWorks(response)).toEqual([
      {
        journal: 'Tạp chí Kinh tế',
        title: 'Bài báo A',
        url: 'https://doi.org/10.1234/abc',
        year: 2026
      }
    ]);
  });

  it('sorts works from newest to oldest and puts works without a year last', () => {
    const response = {
      group: [
        { 'work-summary': [work({ putCode: 1, title: 'Cũ', year: '2021' })] },
        { 'work-summary': [work({ putCode: 2, title: 'Không năm' })] },
        { 'work-summary': [work({ putCode: 3, title: 'Mới', year: '2026' })] }
      ]
    };

    expect(parseOrcidWorks(response).map(({ title }) => title)).toEqual([
      'Mới',
      'Cũ',
      'Không năm'
    ]);
  });

  it('falls back to the work url when there is no DOI', () => {
    const response = {
      group: [
        {
          'work-summary': [
            work({
              putCode: 1,
              title: 'Bài B',
              url: 'https://example.org/b',
              year: '2025'
            })
          ]
        }
      ]
    };

    expect(parseOrcidWorks(response)[0].url).toBe('https://example.org/b');
  });

  it('returns an empty list for an empty or invalid response', () => {
    expect(parseOrcidWorks({ group: [] })).toEqual([]);
    expect(parseOrcidWorks(null)).toEqual([]);
    expect(parseOrcidWorks({})).toEqual([]);
  });
});
