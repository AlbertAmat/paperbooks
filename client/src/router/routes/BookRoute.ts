import {ARoute} from "@/router/ARoute";

/** Route to a single book's detail view (`/app/book/:book_id`). */
export class BookRoute extends ARoute {

    public static PATH = "/book/:book_id";

    private m_name: string = "Book";

    public getRoute() {
        return  {
            name: this.m_name,
            path: BookRoute.PATH,
            component: () => import('@/views/book/BookView.vue'),
        }
    }

    /** @param bookId Id of the book to link to, e.g. `bookRoute.getPath(12)` -> "/book/12". */
    public getPath(bookId: number) {
        return BookRoute.PATH.replace(":book_id", bookId.toString());
    }
}

export const bookRoute = new BookRoute();