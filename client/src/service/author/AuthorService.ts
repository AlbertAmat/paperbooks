import axios from "axios";
import {PATH_PREFIX} from "@/Constants";
import IBookAuthor from "@/types/book/IBookAuthor";
import axiosInstance from "@/plugins/axiosInstance";

export class AuthorService {

    /**
     *
     * @param query
     */
    public async searchAuthors(query: string): Promise<IBookAuthor[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/author/search`, {
            params: {
                query: query
            }
        });
        return data;
    }


}

export const authorService = new AuthorService();