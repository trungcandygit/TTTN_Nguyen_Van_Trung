import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ORCID_ID, ORCID_URL } from './orcid.helper';
import { PUBLICATIONS, PUBLICATION_GROUPS, Publication } from './publications';

interface NumberedPublication {
  number: number;
  publication: Publication;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
  selector: 'gf-about-overview-page',
  styleUrls: ['./about-overview-page.scss'],
  templateUrl: './about-overview-page.html'
})
export class GfAboutOverviewPageComponent {
  protected readonly email = 'kontrungcany@gmail.com';
  protected readonly orcidId = ORCID_ID;
  protected readonly orcidUrl = ORCID_URL;

  /** Details in IEEE order followed by the final period. */
  protected ending({ details }: Publication) {
    return `${details ? `, ${details}` : ''}.`;
  }

  /** Hides the portrait when the file is not in the assets folder. */
  protected hideImage(event: Event) {
    (event.target as HTMLElement).style.display = 'none';
  }

  /** Groups by status, with reference numbers running through all groups. */
  protected readonly groups = (() => {
    let number = 0;

    return PUBLICATION_GROUPS.map(({ statuses, title }) => ({
      items: PUBLICATIONS.filter(({ status }) => statuses.includes(status)).map(
        (publication): NumberedPublication => ({
          number: ++number,
          publication
        })
      ),
      title
    })).filter(({ items }) => items.length > 0);
  })();
}
