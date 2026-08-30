/**
 * Abstract base for the two book view models: `BookItem` (lightweight,
 * search-result shape) and `Book` (full detail, see Book.ts). Holds the
 * fields common to both - identity, name, cover, isbn, category/language -
 * as Vue refs so views re-render when they change.
 */
import IBookItem from "@/types/book/IBookItem";
import BookAuthor from "@/model/author/BookAuthor";
import {bookRoute} from "@/router/routes/BookRoute";
import {ref, Ref, shallowRef, ShallowRef} from "vue";

export default abstract class ABook {

    /** Book id, immutable once loaded. */
    protected readonly m_id: number;

    /** Book title. */
    protected m_name: Ref<string>;

    /** Authors attached to this book. */
    protected m_authors: ShallowRef<BookAuthor[]> = shallowRef([]);

    /** Cover image URL/data-URI, or null if none. */
    protected m_imageUrl: Ref<string | null>;

    /** ISBN code, or null if none. */
    protected m_isbn: Ref<string | null>;

    /** Category id, or null if uncategorized. */
    protected m_categoryId: Ref<number | null>;

    /** 2-letter language code, or null if unset. */
    protected m_languageCode: Ref<string | null>;

    /** @param data Raw book item data from the server. */
    protected constructor(data: IBookItem) {
        this.m_id = data.id;
        this.m_name = ref(data.name);
        this.m_authors.value = data.authors.map((author) => new BookAuthor(author));
        this.m_imageUrl = ref(data.image_url);
        this.m_isbn = ref(data.isbn);
        this.m_categoryId = ref(data.category_id);
        this.m_languageCode = ref(data.language_code);
    }

    /** @returns The book id. */
    public getId(): number {
        return this.m_id;
    }

    /** @returns The book title. */
    public getName(): string {
        return this.m_name.value;
    }

    /** @param value New book title. */
    public setName(value: string) {
        this.m_name.value = value;
    }

    /** @returns Whether the book has at least one author. */
    public hasAuthors(): boolean {
        return this.m_authors.value.length > 0;
    }

    /** @returns The book's authors. */
    public getAuthors(): BookAuthor[] {
        return this.m_authors.value;
    }

    /** @param authors New full list of authors. */
    public setAuthors(authors: BookAuthor[]) {
        this.m_authors.value = authors;
    }

    /** @returns The cover image URL/data-URI, or null if none. */
    public getImageUrl(): string | null {
        return this.m_imageUrl.value;
    }

    /** @returns Whether the book has an ISBN set. */
    public hasIsbn(): boolean {
        return this.m_isbn.value != null;
    }

    /** @returns The ISBN code, or null if none. */
    public getIsbn(): string | null {
        return this.m_isbn.value;
    }

    /** @param value New ISBN code, or null to clear it. */
    public setIsbn(value: string | null) {
        this.m_isbn.value = value;
    }

    /** @returns The category id, or null if uncategorized. */
    public getCategoryId(): number | null {
        return this.m_categoryId.value;
    }

    /** @param value New category id, or null to uncategorize. */
    public setCategoryId(value: number | null) {
        this.m_categoryId.value = value;
    }

    /** @returns The 2-letter language code, or null if unset. */
    public getLanguageCode(): string | null {
        return this.m_languageCode.value;
    }

    /** @param value New 2-letter language code, or null to clear it. */
    public setLanguageCode(value: string | null) {
        this.m_languageCode.value = value;
    }

    /** @returns In-app router path to this book's detail view, e.g. "/book/12". */
    public getUrl(): string {
        return bookRoute.getPath(this.m_id)
    }

}
