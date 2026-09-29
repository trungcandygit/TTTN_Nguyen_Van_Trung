import { hasPermission, permissions } from '@ghostfolio/common/permissions';
import { publicRoutes } from '@ghostfolio/common/routes/routes';
import { GfLogoComponent } from '@ghostfolio/ui/logo';
import { DataService } from '@ghostfolio/ui/services';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page' },
  imports: [GfLogoComponent, MatButtonModule, MatCardModule, RouterModule],
  selector: 'gf-landing-page',
  styleUrls: ['./landing-page.scss'],
  templateUrl: './landing-page.html'
})
export class GfLandingPageComponent {
  public hasPermissionForDemo: boolean;
  public hasPermissionToCreateUser: boolean;
  public routerLinkDemo = publicRoutes.demo.routerLink;
  public routerLinkRegister = publicRoutes.register.routerLink;

  public constructor(private dataService: DataService) {
    const { demoAuthToken, globalPermissions } = this.dataService.fetchInfo();

    this.hasPermissionForDemo = !!demoAuthToken;

    this.hasPermissionToCreateUser = hasPermission(
      globalPermissions,
      permissions.createUserAccount
    );
  }
}
