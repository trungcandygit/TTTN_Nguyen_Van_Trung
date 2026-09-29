import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GfAboutOverviewPageComponent } from './about-overview-page.component';
import { ORCID_URL } from './orcid.helper';

describe('GfAboutOverviewPageComponent', () => {
  let element: HTMLElement;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    const fixture = TestBed.createComponent(GfAboutOverviewPageComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('lists the twelve papers with running IEEE reference numbers', () => {
    const references = Array.from(element.querySelectorAll('.reference'));

    expect(references).toHaveLength(12);
    expect(references[0].textContent).toContain('[1]');
    expect(references[11].textContent).toContain('[12]');
  });

  it('shows the status of every group', () => {
    const headings = Array.from(element.querySelectorAll('h3')).map(
      (heading) => heading.textContent
    );

    expect(headings).toContain('Đã công bố');
    expect(headings).toContain('Đã chấp nhận đăng');
  });

  it('includes the ESG rating paper', () => {
    expect(element.textContent).toContain('Rated at the peak?');
  });

  it('links to the ORCID profile without calling any API', () => {
    const link = element.querySelector(`a[href="${ORCID_URL}"]`);

    expect(link).not.toBeNull();
    httpTestingController.verify();
  });
});
