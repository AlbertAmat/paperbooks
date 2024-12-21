import IBookItem from "@/types/book/IBookItem";
import {formToJSON} from "axios";
import {RoutePaths} from "@/router/Router";

export default abstract class ABook {

    /**
     *
     * @private
     */
    private readonly m_id: number;

    /**
     *
     * @private
     */
    private readonly m_name: string;

    /**
     *
     * @private
     */
    private readonly m_author: string | null;

    /**
     *
     * @private
     */
    private readonly m_imageUrl: string | null;

    /**
     *
     * @private
     */
    private readonly m_isbn: string | null;

    /**
     *
     * @private
     */
    private readonly m_categoryId: number | null;

    /**
     *
     * @private
     */
    private readonly m_languageCode: string | null;

    public constructor(data: IBookItem) {
        this.m_id           = data.id;
        this.m_name         = data.name;
        this.m_author       = data.author;
        this.m_imageUrl     = data.image_url;
        this.m_isbn         = data.isbn;
        this.m_categoryId   = data.category_id;
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
     */
    public hasAuthor(): boolean {
        return this.m_author != null;
    }

    /**
     *
     */
    public getAuthor(): string | null {
        return this.m_author;
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
    public getCategoryId(): number | null {
        return this.m_categoryId;
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
    public getUrl(): string {
        return RoutePaths.BOOK.replace("{book_id}", this.m_id.toString());
    }

}