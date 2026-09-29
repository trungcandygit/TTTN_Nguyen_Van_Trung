import { inject, Service } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Service({ autoProvided: false })
export class PageTitleStrategy extends TitleStrategy {
  private static readonly DEFAULT_TITLE =
    'BL Advisor – Hệ thống hỗ trợ phân bổ danh mục đầu tư';
  private static readonly DEFAULT_TITLE_SHORT = 'BL Advisor';

  private readonly title = inject(Title);

  public override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);

    if (title) {
      this.title.setTitle(
        `${title} – ${PageTitleStrategy.DEFAULT_TITLE_SHORT}`
      );
    } else {
      this.title.setTitle(`${PageTitleStrategy.DEFAULT_TITLE}`);
    }
  }
}
