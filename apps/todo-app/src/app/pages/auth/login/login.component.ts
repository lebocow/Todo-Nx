import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@lib/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authSvc = inject(AuthService);
  private router: Router = inject(Router);

  onSignIn() {
    this.authSvc.login();
    this.router.navigate(['/']);
  }
}
