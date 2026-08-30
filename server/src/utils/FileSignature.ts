/**
 * Content-based validation for the book ebook-file upload (see BooksRoute.ts
 * `POST /:id/file`). The client and multer's `fileFilter` only check the
 * uploaded file's *name* - trivially spoofed by renaming any file to end in
 * `.pdf`/`.epub`. These checks look at the actual bytes instead, so an
 * unrelated (or malicious) file can't ride in disguised as a book.
 */

/** Bytes to scan for the `%PDF-` header - real-world PDFs occasionally have a small preamble before it. */
const PDF_HEADER_SEARCH_WINDOW = 1024;

/** @param buffer Uploaded file bytes. @returns Whether `buffer` starts with a PDF header within the first {@link PDF_HEADER_SEARCH_WINDOW} bytes. */
export function isValidPdf(buffer: Buffer): boolean {
    return buffer.subarray(0, PDF_HEADER_SEARCH_WINDOW).includes("%PDF-");
}

/**
 * An epub is a zip archive whose *first* entry must be a stored (uncompressed)
 * file named `mimetype` containing exactly `application/epub+zip` (EPUB OCF
 * spec). Checking this - rather than just the zip signature - rejects any
 * other zip-based format (docx, jar, apk, a plain zip, ...) riding in as a
 * fake epub.
 * @param buffer Uploaded file bytes.
 */
export function isValidEpub(buffer: Buffer): boolean {
    try {
        // Local file header signature "PK\x03\x04".
        if (buffer.length < 30 || buffer.readUInt32LE(0) !== 0x04034b50) {
            return false;
        }

        const compressionMethod = buffer.readUInt16LE(8);
        const compressedSize = buffer.readUInt32LE(18);
        const fileNameLength = buffer.readUInt16LE(26);
        const extraFieldLength = buffer.readUInt16LE(28);

        const fileName = buffer.subarray(30, 30 + fileNameLength).toString("ascii");
        if (fileName !== "mimetype" || compressionMethod !== 0) {
            return false;
        }

        const contentStart = 30 + fileNameLength + extraFieldLength;
        const content = buffer.subarray(contentStart, contentStart + compressedSize).toString("ascii");
        return content === "application/epub+zip";
    } catch {
        return false;
    }
}
