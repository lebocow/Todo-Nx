import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function matchValidator(matchingControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control.parent as FormGroup;

    if (!group) {
      return null;
    }

    const matchingControl = group.controls[matchingControlName];
    const controlValue = control.value;
    const matchingControlValue = matchingControl.value;

    if (controlValue !== matchingControlValue) {
      return { noMatching: true };
    }

    return null;
  };
}
