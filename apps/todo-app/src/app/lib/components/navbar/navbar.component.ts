import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidenavComponent } from '@lib/components/sidenav/sidenav.component';

import { BreakpointService } from '@lib/services/breakpoint.service';
import { SidenavService } from '@lib/services/sidenav.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    SidenavComponent,
  ],
})
export class NavbarComponent {
  public readonly breakpointSvc = inject(BreakpointService);
  private readonly sidenavSvc = inject(SidenavService);

  toggleSidenav() {
    this.sidenavSvc.toggleSideNav();
  }
}
