import IBookItem from "@/types/book/IBookItem";
import BookAuthor from "@/model/book/BookAuthor";
import {bookRoute} from "@/router/routes/BookRoute";

export default abstract class ABook {

    /**
     *
     * @private
     */
    protected readonly m_id: number;

    /**
     *
     * @private
     */
    protected m_name: string;

    /**
     *
     * @private
     */
    protected m_authors: BookAuthor[];

    /**
     *
     * @private
     */
    protected readonly m_imageUrl: string | null;

    /**
     *
     * @private
     */
    protected m_isbn: string | null;

    /**
     *
     * @private
     */
    protected m_categoryId: number | null;

    /**
     *
     * @private
     */
    protected m_languageCode: string | null;

    public constructor(data: IBookItem) {
        this.m_id = data.id;
        this.m_name = data.name;
        this.m_authors = data.authors.map((author) => new BookAuthor(author));
        this.m_imageUrl = data.image_url;
        this.m_isbn = data.isbn;
        this.m_categoryId = data.category_id;
        this.m_languageCode = data.language_code;
    }

    /**
     *
     */
    public getId(): number {
        return this.m_id;
    }

    /**
     *
     */
    public getName(): string {
        return this.m_name;
    }

    /**
     *
     * @param value
     */
    public setName(value: string) {
        this.m_name = value;
    }

    /**
     *
     */
    public hasAuthors(): boolean {
        return this.m_authors.length > 0;
    }

    /**
     *
     */
    public getAuthors(): BookAuthor[] {
        return this.m_authors;
    }

    /**
     *
     */
    public setAuthors(authors: BookAuthor[]) {
        this.m_authors = authors;
    }

    /**
     *
     */
    public getImageUrl(): string | null {
        return this.m_imageUrl;
    }

    /**
     *
     */
    public hasIsbn(): boolean {
        return this.m_isbn != null;
    }

    /**
     *
     */
    public getIsbn(): string | null {
        return this.m_isbn;
    }

    /**
     *
     */
    public setIsbn(value: string | null) {
        this.m_isbn = value;
    }

    /**
     *
     */
    public getCategoryId(): number | null {
        return this.m_categoryId;
    }

    /**
     *
     */
    public setCategoryId(value: number | null) {
        this.m_categoryId = value;
    }

    /**
     *
     */
    public getLanguageCode(): string | null {
        return this.m_languageCode;
    }

    /**
     *
     */
    public setLanguageCode(value: string | null) {
        this.m_languageCode = value;
    }

    /**
     *
     */
    public getUrl(): string {
        return bookRoute.getPath(this.m_id)
    }

}