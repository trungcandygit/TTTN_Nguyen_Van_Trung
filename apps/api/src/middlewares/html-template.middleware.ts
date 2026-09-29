import { environment } from '@ghostfolio/api/environments/environment';
import { I18nService } from '@ghostfolio/api/services/i18n/i18n.service';
import {
  DEFAULT_LANGUAGE_CODE,
  STORYBOOK_PATH,
  SUPPORTED_LANGUAGE_CODES
} from '@ghostfolio/common/config';
import { DATE_FORMAT, interpolate } from '@ghostfolio/common/helper';

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { format } from 'date-fns';
import { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const title = 'BL Advisor';

const locales: {
  [path: string]: { featureGraphicPath?: string; title?: string };
} = {};

@Injectable()
export class HtmlTemplateMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HtmlTemplateMiddleware.name);

  private indexHtmlMap: { [languageCode: string]: string } = {};

  public constructor(private readonly i18nService: I18nService) {
    if (!environment.production) {
      return;
    }

    this.indexHtmlMap = SUPPORTED_LANGUAGE_CODES.reduce((map, languageCode) => {
      const indexHtmlPath = join(
        __dirname,
        '..',
        'client',
        languageCode,
        'index.html'
      );

      try {
        // Restore the interpolation token which the template replaces with a
        // static fallback title to avoid showing an unresolved template
        // literal when served without interpolation (e.g. by the service worker)
        map[languageCode] = readFileSync(indexHtmlPath, 'utf8').replace(
          /<title>.*?<\/title>/,
          '<title>${title}</title>'
        );
      } catch {
        this.logger.warn(
          `Skipping language '${languageCode}': ${indexHtmlPath} not found`
        );
      }

      return map;
    }, {});
  }

  public use(request: Request, response: Response, next: NextFunction) {
    const path = request.originalUrl.replace(/\/$/, '');
    let languageCode = path.substr(1, 2);

    if (
      !(SUPPORTED_LANGUAGE_CODES as readonly string[]).includes(languageCode) ||
      !this.indexHtmlMap[languageCode]
    ) {
      languageCode = DEFAULT_LANGUAGE_CODE;
    }

    const currentDate = format(new Date(), DATE_FORMAT);
    const rootUrl = process.env.ROOT_URL || environment.rootUrl;

    if (
      path.startsWith('/api/') ||
      path.startsWith(STORYBOOK_PATH) ||
      this.isFileRequest(path) ||
      !environment.production
    ) {
      // Skip
      next();
    } else {
      const indexHtml = interpolate(this.indexHtmlMap[languageCode], {
        currentDate,
        languageCode,
        path,
        rootUrl,
        description: this.i18nService.getTranslation({
          languageCode,
          id: 'metaDescription'
        }),
        featureGraphicPath:
          locales[path]?.featureGraphicPath ?? 'assets/cover.png',
        keywords: this.i18nService.getTranslation({
          languageCode,
          id: 'metaKeywords'
        }),
        title:
          locales[path]?.title ??
          `${title} – ${this.i18nService.getTranslation({
            languageCode,
            id: 'slogan'
          })}`
      });

      return response.send(indexHtml);
    }
  }

  private isFileRequest(filename: string) {
    if (filename === '/assets/LICENSE') {
      return true;
    } else if (
      filename.endsWith('-de.fi') ||
      filename.endsWith('-markets.sh') ||
      filename.includes('auth/ey')
    ) {
      return false;
    }

    return filename.split('.').pop() !== filename;
  }
}
