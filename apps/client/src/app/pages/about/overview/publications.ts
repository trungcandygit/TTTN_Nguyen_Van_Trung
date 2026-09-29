export type PublicationStatus =
  'ACCEPTED' | 'PUBLISHED' | 'REVISION' | 'UNDER_REVIEW';

export interface Publication {
  authors: string;
  /** Volume, pages, year and DOI in IEEE order. Empty until published. */
  details?: string;
  id: string;
  indexing?: string;
  manuscriptId?: string;
  status: PublicationStatus;
  statusLabel: string;
  title: string;
  venue: string;
}

export const PUBLICATION_GROUPS: {
  statuses: PublicationStatus[];
  title: string;
}[] = [
  { statuses: ['PUBLISHED'], title: 'Đã công bố' },
  { statuses: ['ACCEPTED'], title: 'Đã chấp nhận đăng' },
  { statuses: ['REVISION'], title: 'Đang chỉnh sửa theo góp ý phản biện' },
  { statuses: ['UNDER_REVIEW'], title: 'Đã gửi tạp chí, chưa có quyết định' }
];

// Corresponding author on every paper (*). Titles follow IEEE sentence case.
const AUTHORS = 'T. V. Nguyen* et al.';

export const PUBLICATIONS: Publication[] = [
  {
    authors: AUTHORS,
    details: 'vol. 01, pp. 81-99, 2026, doi: 10.63640/3030-4091/jpd.apd.194',
    id: 'jpdr-2026',
    indexing: 'Tạp chí trong nước, không thuộc ISI hoặc Scopus',
    status: 'PUBLISHED',
    statusLabel: 'Đã xuất bản',
    title:
      'Black-Litterman portfolio optimization using regime switching CAPM and ABC-MCMC: Empirical evidence from the Vietnamese stock market period 2019-2025',
    venue:
      'Journal of Policy and Development Research (Học viện Chính sách và Phát triển), ISSN 3030-4091'
  },
  {
    authors: AUTHORS,
    details: '2026, doi: 10.59276/3030-4199/jelb.bav.895',
    id: 'klnh-3128',
    indexing: 'Tạp chí trong nước, không thuộc ISI hoặc Scopus',
    manuscriptId: '3128',
    status: 'PUBLISHED',
    statusLabel: 'Đã đăng',
    title:
      'Tiền gửi không kỳ hạn, hiệu quả hoạt động và ổn định tài chính ngân hàng: Bằng chứng từ mô hình ngưỡng tại Việt Nam',
    venue:
      'Tạp chí Kinh tế - Luật và Ngân hàng (Học viện Ngân hàng), ISSN 3030-4199'
  },
  {
    authors: AUTHORS,
    id: 'ijms-20062',
    indexing: 'Scopus Q3',
    manuscriptId: '20062',
    status: 'ACCEPTED',
    statusLabel: 'Đã duyệt đăng',
    title:
      'GRI adoption and corporate brownwashing: Board governance evidence from ASEAN-5',
    venue:
      'International Journal of Management and Sustainability (Conscientia Beam), ISSN 2306-9856 (print), 2306-0662 (online)'
  },
  {
    authors: AUTHORS,
    id: 'msj-19322',
    indexing: 'Scopus Q3 (SJR 2025)',
    manuscriptId: '19322',
    status: 'REVISION',
    statusLabel: 'Đã sửa xong vòng 2',
    title:
      'Portfolio optimization with the inverse Black-Litterman framework and clustering machine-learning models: Evidence from Vietnamese bank stocks',
    venue:
      'Multidisciplinary Science Journal (Malque Publishing), ISSN 2675-1240'
  },
  {
    authors: AUTHORS,
    id: 'klnh-3129',
    indexing: 'Tạp chí trong nước, không thuộc ISI hoặc Scopus',
    manuscriptId: '3129',
    status: 'REVISION',
    statusLabel:
      'Đã qua 2 vòng phản biện, đang chỉnh sửa, chờ duyệt đăng, chưa công bố',
    title:
      'Tác động của cấu trúc sở hữu lên ổn định tài chính của các ngân hàng thương mại Việt Nam',
    venue:
      'Tạp chí Kinh tế - Luật và Ngân hàng (Học viện Ngân hàng), ISSN 3030-4199'
  },
  {
    authors: AUTHORS,
    id: 'jebs-1563',
    indexing: 'Tạp chí trong nước, không thuộc ISI hoặc Scopus',
    manuscriptId: 'JEBS.1563',
    status: 'REVISION',
    statusLabel: 'Đang sửa vòng 1',
    title:
      'Limits to arbitrage in the Vietnamese physical gold market: The failure of short-term momentum',
    venue:
      'Journal of Economic and Banking Studies (Học viện Ngân hàng, bản tiếng Anh), ISSN 2734-9853'
  },
  {
    authors: AUTHORS,
    id: 'cogent-brownwashing',
    indexing: 'ESCI, Scopus Q2',
    manuscriptId: '260865765',
    status: 'UNDER_REVIEW',
    statusLabel: 'Đang phản biện vòng 1',
    title:
      'Corporate brownwashing and firm valuation in ASEAN-5 disclosure regimes',
    venue: 'Cogent Business & Management (Taylor & Francis), ISSN 2331-1975'
  },
  {
    authors: AUTHORS,
    id: 'ajeb-liquidity',
    status: 'UNDER_REVIEW',
    statusLabel: 'Đang tìm phản biện',
    title:
      'Structural breaks in Vietnamese stock market liquidity: Evidence from the Amihud illiquidity measure and Bai-Perron regime-shift detection',
    venue:
      'Asian Journal of Economics and Banking (Đại học Ngân hàng TP. Hồ Chí Minh, bản tiếng Anh)'
  },
  {
    authors: AUTHORS,
    id: 'apfm-nested',
    indexing: 'Scopus Q2',
    status: 'UNDER_REVIEW',
    statusLabel: 'With Editor',
    title:
      'Nested equity index correlations overstate true co-movement: Evidence from Vietnam',
    venue: 'Asia-Pacific Financial Markets'
  },
  {
    authors: AUTHORS,
    id: 'finance-ftse',
    status: 'UNDER_REVIEW',
    statusLabel: 'With Editor',
    title:
      "Who gains from a market upgrade? Stock liquidity and prices around Vietnam's FTSE Russell reclassification",
    venue: 'Finance Research Open (Elsevier)'
  },
  {
    authors: AUTHORS,
    id: 'accounting-peak',
    status: 'UNDER_REVIEW',
    statusLabel: 'With Editor',
    title:
      'Rated at the peak? Firm valuation around the first LSEG ESG score in five Southeast Asian markets',
    venue: 'Accounting Open (Elsevier)'
  },
  {
    authors: AUTHORS,
    id: 'accounting-rem',
    status: 'UNDER_REVIEW',
    statusLabel: 'With Editor',
    title:
      'Sales-based real earnings management and the cost of debt: Evidence from five ASEAN markets',
    venue: 'Accounting Open (Elsevier)'
  }
];

/** IEEE reference text: authors, "title," venue, details. */
export function formatIeeeReference(publication: Publication): string {
  const { authors, details, title, venue } = publication;

  return `${authors}, "${title}," ${venue}${details ? `, ${details}` : ''}.`;
}
