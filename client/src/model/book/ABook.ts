import IBookItem from "@/types/book/IBookItem";
import BookAuthor from "@/model/author/BookAuthor";
import {bookRoute} from "@/router/routes/BookRoute";
import {ref, Ref, shallowRef, ShallowRef} from "vue";

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
    protected m_name: Ref<string>;

    /**
     *
     * @private
     */
    protected m_authors: ShallowRef<BookAuthor[]> = shallowRef([]);

    /**
     *
     * @private
     */
    protected m_imageUrl: Ref<string | null>;

    /**
     *
     * @private
     */
    protected m_isbn: Ref<string | null>;

    /**
     *
     * @private
     */
    protected m_categoryId: Ref<number | null>;

    /**
     *
     * @private
     */
    protected m_languageCode: Ref<string | null>;

    protected constructor(data: IBookItem) {
        this.m_id = data.id;
        this.m_name = ref(data.name);
        this.m_authors.value = data.authors.map((author) => new BookAuthor(author));
        this.m_imageUrl = ref(data.image_url);
        this.m_isbn = ref(data.isbn);
        this.m_categoryId = ref(data.category_id);
        this.m_languageCode = ref(data.language_code);
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
        return this.m_name.value;
    }

    /**
     *
     * @param value
     */
    public setName(value: string) {
        this.m_name.value = value;
    }

    /**
     *
     */
    public hasAuthors(): boolean {
        return this.m_authors.value.length > 0;
    }

    /**
     *
     */
    public getAuthors(): BookAuthor[] {
        return this.m_authors.value;
    }

    /**
     *
     */
    public setAuthors(authors: BookAuthor[]) {
        this.m_authors.value = authors;
    }

    /**
     *
     */
    public getImageUrl(): string | null {
        return this.m_imageUrl.value;
    }

    /**
     *
     */
    public hasIsbn(): boolean {
        return this.m_isbn.value != null;
    }

    /**
     *
     */
    public getIsbn(): string | null {
        return this.m_isbn.value;
    }

    /**
     *
     */
    public setIsbn(value: string | null) {
        this.m_isbn.value = value;
    }

    /**
     *
     */
    public getCategoryId(): number | null {
        return this.m_categoryId.value;
    }

    /**
     *
     */
    public setCategoryId(value: number | null) {
        this.m_categoryId.value = value;
    }

    /**
     *
     */
    public getLanguageCode(): string | null {
        return this.m_languageCode.value;
    }

    /**
     *
     */
    public setLanguageCode(value: string | null) {
        this.m_languageCode.value = value;
    }

    /**
     *
     */
    public getUrl(): string {
        return bookRoute.getPath(this.m_id)
    }

}