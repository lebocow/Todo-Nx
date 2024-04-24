import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '@lib/services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authSvc = inject(AuthService);

  onSignUp() {
    this.authSvc.register();
  }
}
