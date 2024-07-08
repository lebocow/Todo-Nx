import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  Signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@lib/services';
import { zodValidator } from '@lib/validators/zod-validator.validator';
import { LoginSchema } from '@myworkspace/data-models';
import { ToastrService } from 'ngx-toastr';
import { injectQueryParams } from 'ngxtension/inject-query-params';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormField,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authSvc = inject(AuthService);
  private readonly toastrSvc = inject(ToastrService);

  private readonly router = inject(Router);

  protected isSubmitted = signal(false);

  readonly returnUrl = injectQueryParams('returnUrl', {
    initialValue: '/',
  }) as Signal<string>;

  email = new FormControl<string>('', [
    zodValidator(LoginSchema.shape.email),
    Validators.required,
  ]);
  password = new FormControl<string>('', [
    zodValidator(LoginSchema.shape.password),
    Validators.required,
  ]);

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  onSignIn(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitted.set(true);

    this.authSvc
      .login(this.email.value as string, this.password.value as string)
      .subscribe({
        complete: () => {
          this.router.navigateByUrl(this.returnUrl());
          this.toastrSvc.success('Logged in successfully');
          this.isSubmitted.set(false);
        },
        error: (error: HttpErrorResponse | Error) => {
          const errorMessage =
            error instanceof HttpErrorResponse
              ? error.error.message
              : error.message;

          this.toastrSvc.error(errorMessage);
          this.isSubmitted.set(false);
        },
      });
  }
}
