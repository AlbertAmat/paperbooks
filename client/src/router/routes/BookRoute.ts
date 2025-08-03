import {ARoute} from "@/router/ARoute";

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

    public getPath(bookId: number) {
        return BookRoute.PATH.replace(":book_id", bookId.toString());
    }
}

export const bookRoute = new BookRoute();