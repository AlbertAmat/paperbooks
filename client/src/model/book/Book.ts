/**
 * Full book detail view model (backs the book detail view), extending
 * `BookItem` with description/publisher metadata, its list of physical
 * `BookStock`s, and the mutating operations (`updateBook`, `changeImage`,
 * `deleteBook`, `addBookStock`, `removeBookStock`) that call `BookService`
 * and keep local reactive state in sync with the server.
 *
 * @example
 * const book = new Book(await bookService.getBook(12));
 * await book.addBookStock(BookStockStatusEnum.AVAILABLE, locationId, null, false);
 */
import BookItem from "@/model/book/BookItem";
import IBook from "@/types/book/IBook";
import {IBookFile} from "@/types/book/IBookFile";
import {applicationService} from "@/service/ApplicationService";
import Format from "@/model/format/Format";
import {bookService} from "@/service/book/BookService";
import BookStock from "@/model/book/BookStock";
import {BookStockStatusEnum} from "@/types/book/IBookStock";
import {shallowRef, ShallowRef} from "vue";
import router from "@/router/Router";
import {searchRoute} from "@/router/routes/SearchRoute";
import {appSnackbarController, SnackbarType} from "@/components/appSnackbar/AppSnackbarController";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import {printDialogController} from "@/components/printDialog/PrintDialogController";

export default class Book extends BookItem {

    /** Free-text description. */
    private m_description: string;

    /** Publisher name, or null if unset. */
    private m_publisher: string | null;

    /** Publication date, or null if unset. */
    private m_publishedDate: Date | null;

    /** Page count. */
    private m_pages: number;

    /** Book format (e.g. paperback/hardcover), or null if unset. */
    private m_format: Format | null;

    /** Physical stocks (copies) of this book. */
    private m_stocks: ShallowRef<BookStock[]>;

    /** Backed-up epub/pdf file for this book, or null if none was uploaded. */
    private m_file: ShallowRef<IBookFile | null>;

    /** Timestamp the book was created. */
    private readonly m_dateCreated: Date;

    /** Timestamp the book was last updated. */
    private readonly m_dateUpdated: Date;

    /** @param data Raw full book detail data from the server. */
    public constructor(data: IBook) {
        super(data);
        this.m_description = data.description || "";
        this.m_publisher = data.publisher;
        this.m_publishedDate = data.published_date ? new Date(data.published_date) : null;
        this.m_dateCreated = new Date(data.date_created);
        this.m_dateUpdated = new Date(data.date_updated);
        this.m_pages = data.pages || 0;
        this.m_format = null;
        if (data.format_id) {
            this.m_format = applicationService.getFormat(data.format_id) || null;
        }

        this.m_stocks = shallowRef(data.stocks.map((stock) => new BookStock(this,stock)));
        this.m_file = shallowRef(data.file);
    }

    /** @returns A placeholder "empty" book (id -1) used to initialize forms before real data loads. */
    public static empty(): Book {
        return new Book({
            id: -1,
            name: "",
            image_url: null,
            isbn: null,
            category_id: null,
            language_code: null,
            authors: [],
            description: null,
            publisher: null,
            published_date: null,
            pages: null,
            stocks: [],
            format_id: null,
            date_created: "",
            date_updated: "",
            file: null,
        })
    }

    /** @returns The book's description. */
    public getDescription(): string {
        return this.m_description;
    }

    /** @param value New description. */
    public setDescription(value: string) {
        this.m_description = value;
    }

    /** @returns Whether the book has a publisher set. */
    public hasPublisher(): boolean {
        return this.m_publisher != null;
    }

    /** @returns The publisher name, or null if unset. */
    public getPublisher(): string | null {
        return this.m_publisher;
    }

    /** @param value New publisher name, or null to clear it. */
    public setPublisher(value: string | null) {
        this.m_publisher = value;
    }

    /** @returns Whether the book has a publish date set. */
    public hasPublishDate(): boolean {
        return this.m_publishedDate != null;
    }

    /** @returns The publish date, or null if unset. */
    public getPublishDate(): Date | null {
        return this.m_publishedDate;
    }

    /** @param value New publish date, or null to clear it. */
    public setPublishDate(value: Date | null) {
        this.m_publishedDate = value;
    }

    /** @returns The timestamp the book was created. */
    public getDateCreated(): Date {
        return this.m_dateCreated;
    }

    /** @returns The creation timestamp formatted for display in the user's locale. */
    public getFormatedDateCreated(): string {
        return this.m_dateCreated.toLocaleString();
    }

    /** @returns The timestamp the book was last updated. */
    public getDateUpdated(): Date {
        return this.m_dateUpdated;
    }

    /** @returns The last-updated timestamp formatted for display in the user's locale. */
    public getFormatedDateUpdated(): string {
        return this.m_dateUpdated.toLocaleString();
    }

    /** @returns The page count. */
    public getNumberOfPages(): number {
        return this.m_pages;
    }

    /** @param value New page count. */
    public setNumberOfPages(value: number) {
        this.m_pages = value;
    }

    /** @returns Whether the book has a format set. */
    public hasFormat(): boolean {
        return this.m_format != null;
    }

    /** @returns The book's format, or null if unset. */
    public getFormat(): Format | null {
        return this.m_format;
    }

    /** @param format New format, or null to clear it. */
    public setFormat(format: Format | null) {
        return this.m_format = format;
    }

    /** @returns The book's physical stocks (copies). */
    public getStocks(): BookStock[] {
        return this.m_stocks.value;
    }

    /** @returns The book's backed-up epub/pdf file, or null if none was uploaded. */
    public getFile(): IBookFile | null {
        return this.m_file.value;
    }

    /**
     * Add a new physical stock (copy) of this book, append it to the local
     * list, show a confirmation snackbar, and optionally queue a barcode
     * label for printing via `printDialogController`.
     * @param status Initial stock status.
     * @param locationId Destination location id.
     * @param customerId Customer to assign the copy to, or null.
     * @param print If true, add a printable barcode label to the print queue.
     */
    public async addBookStock(status: BookStockStatusEnum, locationId: number, customerId: number | null, print: boolean) {
        try {
            const data = await bookService.addBookStock(this.m_id, locationId, status, customerId);
            const stock = new BookStock(this, data)
            this.m_stocks.value = [...this.m_stocks.value, stock];

            appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_BOOK_STOCK_ADDED)})

            if(print) {
                printDialogController.addLabel(this.m_name.value, stock.getCode(), stock.generateBarcodeImage());
            }
        } catch (e) {
            console.error("Error while adding book stock", e)
        }
    }

    /**
     * Delete a physical stock from the server and remove it from the local list.
     * @param stockId Id of the stock to remove.
     */
    public async removeBookStock(stockId: number) {
        try {
            const result = await bookService.removeBookStock(this.m_id, stockId);

            if(!result) {
                throw "Unable to remove book stock";
            }

            const index = this.m_stocks.value.findIndex((stock) => stock.getId() === stockId);
            if(index != -1) {
                this.m_stocks.value.splice(index, 1);
                this.m_stocks.value = [...this.m_stocks.value];

                appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_BOOK_STOCK_DELETED)})

            } else {
                console.warn("Unable to remove stock from array since index is -1")
            }
        } catch (e) {
            console.error("Error while removing book stock", e)
        }
    }

    /** Persist all current field values (name, metadata, authors, ...) to the server. */
    public async updateBook() {
        try {
            await bookService.updateBook(
                this.m_id,
                this.m_name.value,
                this.m_imageUrl.value,
                this.m_isbn.value,
                this.m_categoryId.value,
                this.m_languageCode.value,
                this.m_authors.value.map((author) => author.getAuthorId()),
                this.m_description,
                this.m_publisher,
                this.m_publishedDate,
                this.m_pages,
                this.m_format ? this.m_format.getFormatId() : null
            )
            appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_BOOK_UPDATED)})
        } catch (e) {
            console.error("Error while updating book.", e)
        }
    }

    /**
     * Upload a new cover image, then optimistically update the local
     * `imageUrl` by converting the same file to a base64 data URL client-side
     * (avoids waiting for a second round trip to re-fetch the book).
     * @param image New cover image file.
     */
    public async changeImage(image: File) {
        try {
            await bookService.changeImage(this.m_id, image);
            appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_BOOK_IMAGE_UPDATED)})

            /** @param file Image file to encode. @returns A `data:` URL for the file's contents. */
            function fileToBase64(file: File): Promise<string> {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onload = () => {
                        // The result includes the "data:mime/type;base64," prefix
                        resolve(reader.result as string);
                    };

                    reader.onerror = (error) => {
                        reject(error);
                    };

                    reader.readAsDataURL(file); // Reads the file and encodes to Base64
                });
            }

            this.m_imageUrl.value = await fileToBase64(image);
        } catch (e) {
            console.error("Error while updating book.", e)
        }
    }

    /**
     * Upload (or replace) the backed-up epub/pdf file for this book.
     * @param file New epub/pdf file.
     */
    public async uploadFile(file: File) {
        try {
            this.m_file.value = await bookService.uploadFile(this.m_id, file);
            appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_BOOK_FILE_UPLOADED)})
        } catch (e) {
            console.error("Error while uploading book file.", e)
        }
    }

    /** Delete the backed-up epub/pdf file for this book, if any. */
    public async removeFile() {
        try {
            const result = await bookService.deleteFile(this.m_id);

            if (!result) {
                throw "Unable to remove book file";
            }

            this.m_file.value = null;
            appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_BOOK_FILE_DELETED)})
        } catch (e) {
            console.error("Error while removing book file.", e)
        }
    }

    /** Delete this book on the server, then navigate back to the search/library view. */
    public async deleteBook() {
        try {
            await bookService.deleteBook(this.m_id)
            appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_BOOK_DELETED)})
            router.push(searchRoute.getPath())
        } catch (e) {
            console.error("Error while deleting book.", e)
        }
    }

}
