/**
 * ISBN-10 checksum validation: weighted sum of the first 9 digits (weights
 * 10 down to 2) plus the check digit (10 if 'X') must be divisible by 11.
 *
 * @example
 * validateIsbn10("080442957X"); // true
 * @param isbn Exactly 10 characters, digits with an optional trailing 'X'.
 */
export function validateIsbn10(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += (10 - i) * parseInt(isbn[i], 10);
    }
    const checksum = isbn[9].toUpperCase();
    sum += checksum === 'X' ? 10 : parseInt(checksum, 10);
    return sum % 11 === 0;
}

/**
 * ISBN-13 checksum validation: alternating weights of 1 and 3 over the
 * first 12 digits must produce a check digit (13th) matching `(10 - sum%10) % 10`.
 *
 * @example
 * validateIsbn13("9780306406157"); // true
 * @param isbn Exactly 13 digit characters.
 */
export function validateIsbn13(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(isbn[i], 10);
        sum += (i % 2 === 0 ? 1 : 3) * digit;
    }
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(isbn[12], 10);
}
