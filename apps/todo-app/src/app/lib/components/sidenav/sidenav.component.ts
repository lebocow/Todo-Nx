import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { CategoriesListComponent } from '@lib/components';
import { BreakpointService } from '@lib/services/breakpoint.service';
import { SidenavService } from '@lib/services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatToolbar,
    RouterModule,
    MatIconModule,
    CategoriesListComponent,
    MatListModule,
  ],
})
export class SidenavComponent {
  readonly breakpointSvc = inject(BreakpointService);
  readonly sidenavSvc = inject(SidenavService);
}
