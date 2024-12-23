import axios from "axios";
import {PATH_PREFIX} from "@/Constants";
import IBook from "@/types/book/IBook";
import {IBookLocation} from "@/types/book/IBookLocation";

export class BookService {

    /**
     *
     * @param isbn
     */
    public async getBook(id: number): Promise<IBook> {
        const {data} = await axios.get(`${PATH_PREFIX}/book/${id}`, {});
        return data;
    }

    /**
     *
     * @param isbn
     */
    public async getBookLocations(id: number): Promise<IBookLocation[]> {
        const {data} = await axios.get(`${PATH_PREFIX}/book/${id}/locations`, {});
        return data;
    }

    /**
     *
     * @param isbn
     */
    public async createBookFromIsbn(isbn: string) {
        const {data} = await axios.post(`${PATH_PREFIX}/book/isbn/${isbn}`, {});
        return data;
    }

}

export const bookService = new BookService();