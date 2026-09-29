import { publicRoutes } from '@ghostfolio/common/routes/routes';
import {
  GfPageTabsComponent,
  TabConfiguration
} from '@ghostfolio/ui/page-tabs';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { informationCircleOutline, ribbonOutline } from 'ionicons/icons';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  imports: [GfPageTabsComponent],
  selector: 'gf-about-page',
  styleUrls: ['./about-page.scss'],
  templateUrl: './about-page.html'
})
export class AboutPageComponent {
  public tabs: TabConfiguration[] = [
    {
      iconName: 'information-circle-outline',
      label: publicRoutes.about.title,
      routerLink: publicRoutes.about.routerLink
    },
    {
      iconName: 'ribbon-outline',
      label: publicRoutes.about.subRoutes.license.title,
      routerLink: publicRoutes.about.subRoutes.license.routerLink
    }
  ];

  public constructor() {
    addIcons({ informationCircleOutline, ribbonOutline });
  }
}
