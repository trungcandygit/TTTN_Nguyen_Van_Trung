import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import {
  ORCID_ID,
  ORCID_URL,
  ORCID_WORKS_API_URL,
  OrcidWork,
  parseOrcidWorks
} from './orcid.helper';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatProgressBarModule],
  selector: 'gf-about-overview-page',
  styleUrls: ['./about-overview-page.scss'],
  templateUrl: './about-overview-page.html'
})
export class GfAboutOverviewPageComponent implements OnInit {
  protected readonly email = 'kontrungcany@gmail.com';
  protected hasError = false;
  protected isLoading = true;
  protected readonly orcidId = ORCID_ID;
  protected readonly orcidUrl = ORCID_URL;
  protected works: OrcidWork[] = [];

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpClient = inject(HttpClient);

  public ngOnInit() {
    this.httpClient
      .get(ORCID_WORKS_API_URL, { headers: { Accept: 'application/json' } })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.hasError = true;
          this.isLoading = false;

          this.changeDetectorRef.markForCheck();
        },
        next: (response) => {
          this.works = parseOrcidWorks(response);
          this.isLoading = false;

          this.changeDetectorRef.markForCheck();
        }
      });
  }
}
