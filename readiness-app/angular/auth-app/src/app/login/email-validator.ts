import { AbstractControl } from '@angular/forms';

export function EmailValidator(control: AbstractControl) {
    const emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const isValid = emailPattern.test(control.value);
    return isValid ? null : { 'forbiddenName': true};
}
