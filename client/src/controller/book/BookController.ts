import {BaseController} from "@/controller/BaseController";
import IBook from "@/types/book/IBook";
import Book from "@/model/book/Book";
import {bookService} from "@/service/book/BookService";
import router from "@/router/Router";
import {shallowRef, ShallowRef} from "vue";

export default class BookController extends BaseController<IBook>{

    /**
     *
     * @private
     */
    private m_book: ShallowRef<Book |null> = shallowRef(null);

    public constructor() {
        super("Book");
    }

    async fetchData(): Promise<IBook> {
        const bookId = Number(router.currentRoute.params.book_id);
        console.log("bookId", bookId)
        return await bookService.getBook(bookId);
    }

    setData(data: IBook): void {
        this.m_book.value = new Book(data);
    }

    /**
     *
     */
    public hasBook(): boolean {
        return this.m_book.value != null;
    }

    /**
     *
     */
    public getBook(): Book | null {
        return this.m_book.value;
    }
}