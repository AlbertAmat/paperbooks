import BookItem from "@/model/book/BookItem";
import IBook from "@/types/book/IBook";
import {applicationService} from "@/service/ApplicationService";
import Format from "@/model/format/Format";
import {bookService} from "@/service/book/BookService";
import BookStock from "@/model/book/BookStock";
import {BookStockStatusEnum} from "@/types/book/IBookStock";
import {shallowRef, ShallowRef} from "vue";

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

        this.m_stocks = shallowRef(data.stocks.map((stock) => new BookStock(stock)));
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
    public async addBookStock(status: BookStockStatusEnum, locationId: number, print: boolean) {
        try {
            const data = await bookService.addBookStock(this.m_id, locationId, status);
            const stock = new BookStock(data)
            this.m_stocks.value = [...this.m_stocks.value, stock];

            // TODO: snackbar message

            if(print) {
                stock.printBarcode();
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

                // TODO: snackbar message

            } else {
                console.warn("Unable to remove stock from array since index is -1")
            }
        } catch (e) {
            console.error("Error while removing book stock", e)
            // TODO: snackbar message
        }
    }

    /**
     *
     */
    public async updateBook() {
        try {
            await bookService.updateBook(
                this.m_id,
                this.m_name,
                this.m_imageUrl,
                this.m_isbn,
                this.m_categoryId,
                this.m_languageCode,
                this.m_authors.map((author) => author.getAuthorId()),
                this.m_description,
                this.m_publisher,
                this.m_publishedDate,
                this.m_pages,
                this.m_format ? this.m_format.getFormatId() : null
            )
            console.log(`Update book ${this.m_id} successfully`)
            // TODO: snackbar message
        } catch (e) {
            console.error("Error while updating book.", e)
        }
    }

}