import {ARoute} from "@/router/ARoute";

/** Route to the book search/library view (`/app/library/search`), with an optional preset query string. */
export class SearchRoute extends ARoute {

    public static PATH = "/library/search";

    private m_name: string = "Library";

    /** Query string param name the search view reads its initial search text from. */
    public static QUERY_PARAM = "query";

    public getRoute() {
        return  {
            name: this.m_name,
            path: SearchRoute.PATH,
            component: () => import('@/views/search/BooksSearchView.vue'),
        }
    }

    /** @param query Optional initial search text, appended as `?query=...`. */
    public getPath(query?: string) {
        if (query) {
            return `${SearchRoute.PATH}?${SearchRoute.QUERY_PARAM}=${encodeURIComponent(query)}`;
        }
        return SearchRoute.PATH;
    }
}

export const searchRoute = new SearchRoute();