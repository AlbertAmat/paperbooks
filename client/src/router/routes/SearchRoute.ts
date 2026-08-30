import {ARoute} from "@/router/ARoute";
import {SearchFilter} from "@/types/search/SearchFilter";

/** Route to the book search/library view (`/app/library/search`), with an optional preset query string. */
export class SearchRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/library/search";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Library";

    /** Query string param name the search view reads its initial search text from. */
    public static QUERY_PARAM = "query";

    /** Query string param name the search view reads its initial category filter from. */
    public static CATEGORY_QUERY_PARAM = "category";

    /** Query string param name the search view reads its initial `SearchFilter`(s) from (comma-separated). */
    public static FILTERS_QUERY_PARAM = "filters";

    /** @returns The Vue Router route config for the search/library view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: SearchRoute.PATH,
            component: () => import('@/views/search/BooksSearchView.vue'),
        }
    }

    /**
     * @param query Optional initial search text, appended as `?query=...`.
     * @returns The navigable URL for the search/library view.
     */
    public getPath(query?: string) {
        if (query) {
            return `${SearchRoute.PATH}?${SearchRoute.QUERY_PARAM}=${encodeURIComponent(query)}`;
        }
        return SearchRoute.PATH;
    }

    /**
     * @param categoryId Category id to pre-filter the search/library view by.
     * @returns The navigable URL for the search/library view, filtered to that category.
     */
    public getPathForCategory(categoryId: number) {
        return `${SearchRoute.PATH}?${SearchRoute.CATEGORY_QUERY_PARAM}=${categoryId}`;
    }

    /**
     * @param filter `SearchFilter` to pre-filter the search/library view by.
     * @returns The navigable URL for the search/library view, pre-filtered.
     */
    public getPathForFilter(filter: SearchFilter) {
        return `${SearchRoute.PATH}?${SearchRoute.FILTERS_QUERY_PARAM}=${filter}`;
    }
}

/** Singleton instance used throughout the app for navigation. */
export const searchRoute = new SearchRoute();
