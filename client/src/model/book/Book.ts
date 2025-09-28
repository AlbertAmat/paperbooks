import BookItem from "@/model/book/BookItem";
import IBook from "@/types/book/IBook";
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

    /**
     *
     * @private
     */
    private m_description: string;

    /**
     *
     * @private
     */
    private m_publisher: string | null;

    /**
     *
     * @private
     */
    private m_publishedDate: Date | null;

    /**
     *
     * @private
     */
    private m_pages: number;

    /**
     *
     * @private
     */
    private m_format: Format | null;

    /**
     *
     * @private
     */
    private m_stocks: ShallowRef<BookStock[]>;

    /**
     *
     * @private
     */
    private readonly m_dateCreated: Date;

    /**
     *
     * @private
     */
    private readonly m_dateUpdated: Date;

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
    }

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
        })
    }

    /**
     *
     */
    public getDescription(): string {
        return this.m_description;
    }

    /**
     *
     */
    public setDescription(value: string) {
        this.m_description = value;
    }

    /**
     *
     */
    public hasPublisher(): boolean {
        return this.m_publisher != null;
    }

    /**
     *
     */
    public getPublisher(): string | null {
        return this.m_publisher;
    }

    /**
     *
     */
    public setPublisher(value: string | null) {
        this.m_publisher = value;
    }

    /**
     *
     */
    public hasPublishDate(): boolean {
        return this.m_publishedDate != null;
    }

    /**
     *
     */
    public getPublishDate(): Date | null {
        return this.m_publishedDate;
    }

    /**
     *
     */
    public setPublishDate(value: Date | null) {
        this.m_publishedDate = value;
    }

    /**
     *
     */
    public getDateCreated(): Date {
        return this.m_dateCreated;
    }

    /**
     *
     */
    public getFormatedDateCreated(): string {
        return this.m_dateCreated.toLocaleString();
    }

    /**
     *
     */
    public getDateUpdated(): Date {
        return this.m_dateUpdated;
    }

    /**
     *
     */
    public getFormatedDateUpdated(): string {
        return this.m_dateUpdated.toLocaleString();
    }

    /**
     *
     */
    public getNumberOfPages(): number {
        return this.m_pages;
    }

    /**
     *
     */
    public setNumberOfPages(value: number) {
        this.m_pages = value;
    }

    /**
     *
     */
    public hasFormat(): boolean {
        return this.m_format != null;
    }

    /**
     *
     */
    public getFormat(): Format | null {
        return this.m_format;
    }

    /**
     *
     */
    public setFormat(format: Format | null) {
        return this.m_format = format;
    }

    /**
     *
     */
    public getStocks(): BookStock[] {
        return this.m_stocks.value;
    }

    /**
     *
     * @param status
     * @param locationId
     * @param print
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

    /**
     *
     */
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
     *
     */
    public async changeImage(image: File) {
        try {
            await bookService.changeImage(this.m_id, image);
            appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_BOOK_IMAGE_UPDATED)})

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