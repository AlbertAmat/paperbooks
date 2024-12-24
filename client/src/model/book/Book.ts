import BookItem from "@/model/book/BookItem";
import IBook from "@/types/book/IBook";
import {applicationService} from "@/service/ApplicationService";
import Format from "@/model/format/Format";
import {bookService} from "@/service/book/BookService";

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
        } catch (e) {
            console.log("Error while updating book")
        }
    }
}