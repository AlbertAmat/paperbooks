/**
 * Backs the book search/library view: paginated, filterable search with an
 * "infinite scroll"-style `fetchBooks(clear)` that either replaces the
 * current results (new query/filter) or appends the next page. The initial
 * search text comes from the `query` route param (see `SearchRoute`).
 */
import {BaseController} from "@/controller/BaseController";
import {searchService} from "@/service/search/SearchService";
import {ref, Ref, shallowRef, ShallowRef} from "vue";
import BookItem from "@/model/book/BookItem";
import {ISearchResponse} from "@/types/search/ISearchResponse";
import router from "@/router/Router";
import {SearchRoute} from "@/router/routes/SearchRoute";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import {SearchFilter} from "@/types/search/SearchFilter";

export default class SearchController extends BaseController<ISearchResponse> {

    /** Zero-based index of the currently loaded page. */
    private m_page: Ref<number> = ref(0);

    /** Total number of books matching the current search, across all pages. */
    private m_totalBooks: Ref<number> = ref(0);

    /** Currently active `SearchFilter` values. */
    private m_filters: Ref<SearchFilter[]> = ref([]);

    /** Number of results per page, as reported by the server. */
    private m_limit: number = 0;

    /** Books loaded so far for the current query/filters. */
    private m_books: ShallowRef<BookItem[]>;

    public constructor() {
        super(i18n.global.t(AppLabels.LIBRARY));
        this.m_books = shallowRef([]);
    }

    /** @returns The first page of results for the route's initial `query` param, with no filters. */
    async fetchData(): Promise<ISearchResponse> {
        const params = router.currentRoute.value.query;
        const query = params[SearchRoute.QUERY_PARAM] ? params[SearchRoute.QUERY_PARAM] as string : null;

        return await searchService.searchBooks(
            query,
            null,
            0,
            []
        )
    }

    /** @param data Raw search response from the server, or null. */
    setData(data: ISearchResponse | null) {
        if(data) {
            this.m_totalBooks.value = data.total;
            this.m_limit = data.limit;
            this.m_books.value = data.books.map((book) => new BookItem(book));
        }
    }

    /**
     * Re-run the search for the current query/page/filters.
     * @param clear If true, replace the current results (new search/filter
     * change); if false/omitted, append to them (loading the next page).
     */
    public async fetchBooks(clear?: boolean) {
        try {
            const params = router.currentRoute.value.query;
            const query = params[SearchRoute.QUERY_PARAM] ? params[SearchRoute.QUERY_PARAM] as string : null;
            const data = await searchService.searchBooks(
                query,
                null,
                this.m_page.value,
                this.m_filters.value
            );

            if(clear) {
                this.m_books.value = data.books.map((book) => new BookItem(book));
            } else {
                this.m_books.value = [...this.m_books.value, ...data.books.map((book) => new BookItem(book))];
            }
        } catch (e) {
            console.log("Error while fetching books", e)
        }
    }

    /** @returns The total number of books matching the current search. */
    public getTotalBooks(): number {
        return this.m_totalBooks.value;
    }

    /** @returns The number of results per page. */
    public getLimit(): number {
        return this.m_limit;
    }

    /** @returns The zero-based index of the currently loaded page. */
    public getPage(): number {
        return this.m_page.value;
    }

    /** @returns Whether there is a page before the current one. */
    public hasPreviousPage(): boolean {
        return this.m_page.value > 0;
    }

    /** Decrement the current page index, if there is a previous page. */
    public prevPage() {
        if(this.hasPreviousPage()) {
            return this.m_page.value--;
        }
    }

    /** @returns Whether there are more results beyond the currently loaded page(s). */
    public hasNextPage():boolean {
        return this.m_totalBooks.value > (this.m_page.value + 1) * this.m_limit;
    }

    /** Increment the current page index. */
    public nextPage() {
        return this.m_page.value++;
    }

    /** @param page New zero-based page index. */
    public setPage(page: number) {
        return this.m_page.value = page;
    }

    /** @returns Whether any books are currently loaded. */
    public hasBooks(): boolean {
        return this.m_books.value.length > 0;
    }

    /** @returns The books loaded so far for the current query/filters. */
    public getBooks(): BookItem[] {
        return this.m_books.value;
    }

    /** @returns The currently active search filters. */
    public getFilters(): SearchFilter[] {
        return this.m_filters.value;
    }

    /**
     * Enable a search filter, reset to page 0, and re-run the search from scratch.
     * @param filter Filter to add.
     */
    public addFilter(filter: SearchFilter) {
        if(!this.m_filters.value.includes(filter)) {
            this.m_filters.value.push(filter)
            this.m_page.value = 0;
            this.fetchBooks(true);
        }
    }

    /**
     * Disable a search filter, reset to page 0, and re-run the search from scratch.
     * @param filter Filter to remove.
     */
    public removeFilter(filter: SearchFilter) {
        if(this.m_filters.value.includes(filter)) {
            this.m_filters.value.splice(this.m_filters.value.indexOf(filter), 1);
            this.m_filters.value = [...this.m_filters.value];
            this.m_page.value = 0;
            this.fetchBooks(true);
        }
    }
}
