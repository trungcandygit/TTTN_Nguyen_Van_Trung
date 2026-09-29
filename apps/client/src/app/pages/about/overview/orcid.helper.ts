export const ORCID_ID = '0009-0008-3307-6569';
export const ORCID_URL = `https://orcid.org/${ORCID_ID}`;
export const ORCID_WORKS_API_URL = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;

export interface OrcidWork {
  journal?: string;
  title: string;
  url?: string;
  year?: number;
}

/**
 * Maps the JSON response of the public ORCID API (`/works`) to a flat list of
 * publications, sorted from newest to oldest (works without a year last).
 */
export function parseOrcidWorks(response: any): OrcidWork[] {
  const groups: any[] = Array.isArray(response?.group) ? response.group : [];

  return groups
    .map((group) => group?.['work-summary']?.[0])
    .filter((summary) => !!summary?.title?.title?.value)
    .map((summary): OrcidWork => {
      const externalIds: any[] = summary['external-ids']?.['external-id'] ?? [];
      const doi = externalIds.find((externalId) => {
        return externalId?.['external-id-type'] === 'doi';
      });
      const year = Number.parseInt(
        summary['publication-date']?.year?.value,
        10
      );

      return {
        journal: summary['journal-title']?.value ?? undefined,
        title: summary.title.title.value,
        url: doi?.['external-id-url']?.value ?? summary.url?.value ?? undefined,
        year: Number.isNaN(year) ? undefined : year
      };
    })
    .sort((a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity));
}
