import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, TokenService } from '@lib/services';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly authSvc = inject(AuthService);
  private readonly tokenSvc = inject(TokenService);

  constructor() {
    // if (this.tokenSvc.refreshToken && !this.tokenSvc.accessToken) {
    //   this.authSvc.refreshToken().subscribe();
    // }
  }
}
