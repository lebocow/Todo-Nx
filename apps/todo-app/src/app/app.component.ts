import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
export class AppComponent implements OnInit {
  private readonly authSvc = inject(AuthService);
  private readonly tokenSvc = inject(TokenService);

  ngOnInit(): void {
    if (this.tokenSvc.refreshToken) {
      this.authSvc.isAuthenticated.set(true);
    }
  }
}
