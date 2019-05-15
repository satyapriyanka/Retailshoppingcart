import { ValidatorFn, AbstractControl } from "@angular/forms";


export class NoWhiteSpaceValidator {
    static minLength(minLength): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            let isWhitespace = (control.value || '').trim().length < minLength;
            let isValid = !isWhitespace;
            return isValid ? null : { 'whitespace': `value is should be minimum of ${minLength} characters.` }
        };
    }
}