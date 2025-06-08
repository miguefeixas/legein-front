import { AbstractControl, ValidationErrors } from '@angular/forms';

export function isbnValidator(
  control: AbstractControl
): ValidationErrors | null {
  const isbn = control.value?.replace(/[-\s]/g, '');
  if (!isbn) {
    return null;
  }

  if (isbn.length !== 10 && isbn.length !== 13) {
    return { invalidLength: true };
  }

  if (isbn.length === 10 && validateIsbn10(isbn)) {
    return null;
  }

  if (isbn.length === 13 && validateIsbn13(isbn)) {
    return null;
  }

  return { invalidIsbn: true }; // ISBN no es válido
}

function validateIsbn10(isbn: string): boolean {
  let total = 0;
  for (let i = 0; i < 9; i++) {
    total += (10 - i) * parseInt(isbn[i], 10);
  }

  const checkDigit = isbn[9].toUpperCase();
  total += checkDigit === 'X' ? 10 : parseInt(checkDigit, 10);

  return total % 11 === 0;
}

function validateIsbn13(isbn: string): boolean {
  let total = 0;
  for (let i = 0; i < 12; i++) {
    total += parseInt(isbn[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (total % 10)) % 10;

  return checkDigit === parseInt(isbn[12], 10);
}
