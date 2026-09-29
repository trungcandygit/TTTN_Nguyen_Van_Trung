import { environment } from '@ghostfolio/api/environments/environment';
import { DEFAULT_LANGUAGE_CODE } from '@ghostfolio/common/config';

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function languageRedirectMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (
    !environment.production ||
    request.path !== '/' ||
    !['GET', 'HEAD'].includes(request.method)
  ) {
    return next();
  }

  // The application is served in Vietnamese by default, regardless of the
  // Accept-Language header of the browser. Other languages remain available
  // via their prefixed routes (e.g. /en/) and the user settings.
  const languageCode = DEFAULT_LANGUAGE_CODE;

  return response.redirect(
    StatusCodes.MOVED_PERMANENTLY,
    `/${languageCode}${request.url.slice(1)}`
  );
}
