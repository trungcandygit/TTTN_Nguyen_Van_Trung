import { publicRoutes } from '@ghostfolio/common/routes/routes';
import {
  GfPageTabsComponent,
  TabConfiguration
} from '@ghostfolio/ui/page-tabs';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { bookOutline } from 'ionicons/icons';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  imports: [GfPageTabsComponent],
  selector: 'gf-resources-page',
  styleUrls: ['./resources-page.scss'],
  templateUrl: './resources-page.html'
})
export class ResourcesPageComponent {
  public tabs: TabConfiguration[] = [
    {
      iconName: 'book-outline',
      label: 'Hướng dẫn',
      routerLink: publicRoutes.resources.routerLink
    }
  ];

  public constructor() {
    addIcons({ bookOutline });
  }
}
