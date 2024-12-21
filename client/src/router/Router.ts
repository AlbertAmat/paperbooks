import Vue                                                    from "vue";
import VueRouter, { RouteConfig } from "vue-router";

/**
 * Tell Vue to user Vue router.
 */
Vue.use(VueRouter);

export enum RoutePaths {
    OVERVIEW = "/overview",
    SEARCH_BOOKS = "/books/search",
    BOOK = "/book/{book_id}"
}

/**
 *
 */
const routes: Array<RouteConfig> = [
    {
        path: "/",
        redirect: RoutePaths.OVERVIEW,
    },
    {
        name: "Overview",
        path: RoutePaths.OVERVIEW,
        component: () => import("@/views/overview/OverviewView.vue")
    },
    {
        name: "Search books",
        path: RoutePaths.SEARCH_BOOKS,
        component: () => import("@/views/search/BooksSearchView.vue")
    },
    {
        name: "Book",
        path: RoutePaths.BOOK,
        component: () => import("@/views/book/BookView.vue")
    }

    // ========================================================================
    // Error route
    // ========================================================================

    // ========================================================================
    // Not Found route
    // ========================================================================
];

/**
 *
 */
const router = new VueRouter({
    mode: "history",
    routes
});

/**
 * Export router instance.
 */
export default router;
