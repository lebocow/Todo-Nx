import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidenavComponent } from '@lib/components/sidenav/sidenav.component';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatars';
import {
  AuthService,
  UserService,
  BreakpointService,
  SidenavService,
} from '@lib/services';

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
    MatMenuModule,
    AvatarModule,
  ],
})
export class NavbarComponent {
  readonly breakpointSvc = inject(BreakpointService);
  readonly userSvc = inject(UserService);
  readonly authSvc = inject(AuthService);

  private readonly sidenavSvc = inject(SidenavService);

  onToggleSidenav() {
    this.sidenavSvc.toggleSideNav();
  }

  onLogout() {
    this.authSvc.logout();
  }
}
