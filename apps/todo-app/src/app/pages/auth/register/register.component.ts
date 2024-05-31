import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '@lib/services';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { zodValidator } from '@lib/validators/zod-validator.validator';
import { BaseRegisterSchema } from '@myworkspace/data-models';
import { matchValidator } from '@lib/validators/match-validator';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authSvc = inject(AuthService);
  private toastrSvc = inject(ToastrService);

  name = new FormControl('', [
    zodValidator(BaseRegisterSchema.shape.name),
    Validators.required,
  ]);
  email = new FormControl('', [
    zodValidator(BaseRegisterSchema.shape.email),
    Validators.required,
  ]);
  password = new FormControl('', [
    zodValidator(BaseRegisterSchema.shape.password),
    Validators.required,
  ]);
  confirmPassword = new FormControl('', [
    matchValidator('password'),
    Validators.required,
  ]);

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword,
  });

  onSignUp() {
    if (this.registerForm.invalid) {
      return;
    }

    this.authSvc
      .register(
        this.name.value as string,
        this.email.value as string,
        this.password.value as string,
        this.confirmPassword.value as string,
      )
      .subscribe({
        complete: () => {
          this.toastrSvc.success('Registration successful!');
        },
        error: (error: HttpErrorResponse) => {
          this.toastrSvc.error(error.error.message);
        },
      });
  }
}
