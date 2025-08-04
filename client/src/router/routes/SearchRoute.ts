import {ARoute} from "@/router/ARoute";

export class SearchRoute extends ARoute {

    public static PATH = "/library/search";

    private m_name: string = "Library";

    public static QUERY_PARAM = "query";

    public getRoute() {
        return  {
            name: this.m_name,
            path: SearchRoute.PATH,
            component: () => import('@/views/search/BooksSearchView.vue'),
        }
    }

    public getPath(query?: string) {
        if (query) {
            return `${SearchRoute.PATH}?${SearchRoute.QUERY_PARAM}=${encodeURIComponent(query)}`;
        }
        return SearchRoute.PATH;
    }
}

export const searchRoute = new SearchRoute();