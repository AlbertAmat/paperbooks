import axios from "axios";
import {PATH_PREFIX} from "@/Constants";
import IBook from "@/types/book/IBook";
import {IBookLocation} from "@/types/book/IBookLocation";
import IBookAuthor from "@/types/book/IBookAuthor";

export class AuthorService {

    /**
     *
     * @param query
     */
    public async searchAuthors(query: string): Promise<IBookAuthor[]> {
        const {data} = await axios.get(`${PATH_PREFIX}/author/search`, {
            params: {
                query: query
            }
        });
        return data;
    }


}

export const authorService = new AuthorService();