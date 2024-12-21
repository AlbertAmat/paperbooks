import axios from "axios";
import {PATH_PREFIX} from "@/Constants";

export class BookService {

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