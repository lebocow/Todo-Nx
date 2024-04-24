import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);

  login(): void {
    this.isAuthenticated.set(true);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  register(): void {}

  logout(): void {
    this.isAuthenticated.set(false);
  }
}
