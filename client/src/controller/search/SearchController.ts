import {BaseController} from "@/controller/BaseController";
import {searchService} from "@/service/search/SearchService";
import {ref, Ref, shallowRef, ShallowRef} from "vue";
import BookItem from "@/model/book/BookItem";
import {ISearchResponse} from "@/types/search/ISearchResponse";

export default class SearchController extends BaseController<ISearchResponse> {

    /**
     *
     * @private
     */
    private m_page: Ref<number> = ref(0);

    /**
     *
     * @private
     */
    private m_totalBooks: number = 0;

    /**
     *
     * @private
     */
    private m_limit: number = 0;

    /**
     *
     * @private
     */
    private m_books: ShallowRef<BookItem[]>;

    public constructor() {
        super("Search books");

        this.m_books = shallowRef([]);
    }

    async fetchData(): Promise<ISearchResponse> {
        return await searchService.searchBooks(
            null,
            null,
            null,
            null,
            0
        )
    }

    setData(data: ISearchResponse | null) {
        if(data) {
            this.m_totalBooks = data.total;
            this.m_limit = data.limit;
            this.m_books.value = data.books.map((book) => new BookItem(book));
        }
    }

    /**
     *
     * @param page
     */
    public async fetchBooks() {
        try {
            const data = await searchService.searchBooks(
                null,
                null,
                null,
                null,
                this.m_page.value
            );

            this.m_books.value.push(...data.books.map((book) => new BookItem(book)));
        } catch (e) {
            console.log("Error while fetching books", e)
        }
    }

    /**
     *
     */
    public getTotalBooks(): number {
        return this.m_totalBooks;
    }

    /**
     *
     */
    public getLimit(): number {
        return this.m_limit;
    }

    /**
     *
     */
    public getPage(): number {
        return this.m_page.value;
    }

    /**
     *
     */
    public hasPreviousPage(): boolean {
        return this.m_page.value > 0;
    }

    /**
     *
     */
    public prevPage() {
        if(this.hasPreviousPage()) {
            return this.m_page.value--;
        }
    }

    /**
     *
     */
    public hasNextPage():boolean {
        return this.m_totalBooks > (this.m_page.value + 1) * this.m_limit;
    }

    /**
     *
     */
    public nextPage() {
        return this.m_page.value++;
    }

    /**
     *
     */
    public hasBooks(): boolean {
        return this.m_books.value.length > 0;
    }

    /**
     *
     */
    public getBooks(): BookItem[] {
        return this.m_books.value;
    }

}