import {ARoute} from "@/router/ARoute";

/** Route to a single book's detail view (`/app/book/:book_id`). */
export class BookRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/book/:book_id";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Book";

    /** @returns The Vue Router route config for the book detail view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: BookRoute.PATH,
            component: () => import('@/views/book/BookView.vue'),
        }
    }

    /**
     * @param bookId Id of the book to link to, e.g. `bookRoute.getPath(12)` -> "/book/12".
     * @returns The navigable URL for that book's detail view.
     */
    public getPath(bookId: number) {
        return BookRoute.PATH.replace(":book_id", bookId.toString());
    }
}

/** Singleton instance used throughout the app for navigation. */
export const bookRoute = new BookRoute();
