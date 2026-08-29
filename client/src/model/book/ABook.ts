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

    protected readonly m_id: number;
    protected m_name: Ref<string>;
    protected m_authors: ShallowRef<BookAuthor[]> = shallowRef([]);
    protected m_imageUrl: Ref<string | null>;
    protected m_isbn: Ref<string | null>;
    protected m_categoryId: Ref<number | null>;
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

    public getId(): number {
        return this.m_id;
    }

    public getName(): string {
        return this.m_name.value;
    }

    public setName(value: string) {
        this.m_name.value = value;
    }

    public hasAuthors(): boolean {
        return this.m_authors.value.length > 0;
    }

    public getAuthors(): BookAuthor[] {
        return this.m_authors.value;
    }

    public setAuthors(authors: BookAuthor[]) {
        this.m_authors.value = authors;
    }

    public getImageUrl(): string | null {
        return this.m_imageUrl.value;
    }

    public hasIsbn(): boolean {
        return this.m_isbn.value != null;
    }

    public getIsbn(): string | null {
        return this.m_isbn.value;
    }

    public setIsbn(value: string | null) {
        this.m_isbn.value = value;
    }

    public getCategoryId(): number | null {
        return this.m_categoryId.value;
    }

    public setCategoryId(value: number | null) {
        this.m_categoryId.value = value;
    }

    public getLanguageCode(): string | null {
        return this.m_languageCode.value;
    }

    public setLanguageCode(value: string | null) {
        this.m_languageCode.value = value;
    }

    /** In-app router path to this book's detail view, e.g. "/book/12". */
    public getUrl(): string {
        return bookRoute.getPath(this.m_id)
    }

}
