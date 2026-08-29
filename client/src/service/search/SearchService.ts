import {PATH_PREFIX} from "@/Constants";
import {ISearchResponse} from "@/types/search/ISearchResponse";
import axiosInstance from "@/plugins/axiosInstance";
import {SearchFilter} from "@/types/search/SearchFilter";

/**
 * Thin HTTP client for the `/api/rest/book/search` endpoint (see server/src/routes/BooksRoute.ts).
 *
 * @example
 * const {books, total} = await searchService.searchBooks("hobbit", null, 0, [SearchFilter.HAS_STOCK]);
 */
class SearchService {

    /**
     * Paginated, filterable search over the user's books.
     * @param query Free-text match against book name/isbn, or null.
     * @param category_id Restrict to a single category id, or null for all.
     * @param page Zero-based page index (50 results per page).
     * @param filters Extra `SearchFilter` values to narrow by stock availability.
     */
    public async searchBooks(
        query: string | null,
        category_id: number | null,
        page: number,
        filters: SearchFilter[]
    ): Promise<ISearchResponse> {

        const {data} = await axiosInstance.get(`${PATH_PREFIX}/book/search`, {
            params: {
                query: query,
                category_id: category_id,
                page: page,
                filters: filters.join(",")
            }
        })

        return data;
    }
}

export const searchService = new SearchService();
