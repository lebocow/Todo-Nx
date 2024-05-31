import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { fromError } from 'zod-validation-error';
import { ZodSchema } from 'zod';

export function zodValidator(schema: ZodSchema): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const result = schema.safeParse(control.value);
    if (result.success) {
      return null;
    }

    const zodErrors = fromError(result.error).details;

    const errors = zodErrors.reduce(
      (acc, error) => {
        acc[error.code] = error.message;
        return acc;
      },
      {} as Record<string, string>,
    );

    return errors;
  };
}
