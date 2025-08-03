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
    private m_book: ShallowRef<Book> = shallowRef(Book.empty());

    public constructor() {
        super("Book");
    }

    async fetchData(): Promise<IBook> {
        console.log("router.currentRoute", router.currentRoute.value.params)
        const bookId = Number(router.currentRoute.value.params.book_id);
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
    public getBook(): Book {
        return this.m_book.value;
    }
}