import {
  ChangeDetectionStrategy,
  Component,
  input,
  viewChild,
} from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenavModule, MatToolbar, MatNavList, MatListItem, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  isHandset = input.required<boolean | null>();

  drawer = viewChild.required<MatSidenav>('drawer');

  async toggleDrawer() {
    await this.drawer().toggle();
  }
}
