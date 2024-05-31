import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  readonly isSideNavOpen = signal(false);

  toggleSideNav(): void {
    this.isSideNavOpen.set(!this.isSideNavOpen());
  }
}
