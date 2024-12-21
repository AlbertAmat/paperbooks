
// ISBN-10 validation
export function validateIsbn10(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += (10 - i) * parseInt(isbn[i], 10);
    }
    const checksum = isbn[9].toUpperCase();
    sum += checksum === 'X' ? 10 : parseInt(checksum, 10);
    return sum % 11 === 0;
}

// ISBN-13 validation
export function validateIsbn13(isbn: string): boolean {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        const digit = parseInt(isbn[i], 10);
        sum += (i % 2 === 0 ? 1 : 3) * digit;
    }
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === parseInt(isbn[12], 10);
}