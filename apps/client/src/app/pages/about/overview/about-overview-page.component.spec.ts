import { AuthInterceptor } from '@ghostfolio/client/core/auth.interceptor';
import { KEY_TOKEN } from '@ghostfolio/client/services/settings-storage.service';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GfAboutOverviewPageComponent } from './about-overview-page.component';
import { ORCID_WORKS_API_URL } from './orcid.helper';

describe('GfAboutOverviewPageComponent', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    window.localStorage.setItem(KEY_TOKEN, 'SECRET-USER-TOKEN');

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        AuthInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useExisting: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    window.localStorage.removeItem(KEY_TOKEN);
  });

  it('never sends the login token of the user to ORCID', () => {
    const fixture = TestBed.createComponent(GfAboutOverviewPageComponent);
    fixture.detectChanges();

    const request = httpTestingController.expectOne(ORCID_WORKS_API_URL);

    expect(request.request.headers.has('Authorization')).toBe(false);
    expect(request.request.headers.has('X-Timezone')).toBe(false);
  });
});
