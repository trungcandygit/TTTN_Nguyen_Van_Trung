import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
  selector: 'gf-resources-overview',
  styleUrls: ['./resources-overview.component.scss'],
  templateUrl: './resources-overview.component.html'
})
export class ResourcesOverviewComponent {}
