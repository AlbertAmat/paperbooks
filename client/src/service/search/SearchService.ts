import axios from "axios";
import {PATH_PREFIX} from "@/Constants";
import IBookItem from "@/types/book/IBookItem";
import {ISearchResponse} from "@/types/search/ISearchResponse";

class SearchService {

    public async searchBooks(
        name: string | null,
        isbn: string | null,
        author: string | null,
        category_id: number | null,
        page: number
    ): Promise<ISearchResponse> {

        const {data} = await axios.get(`${PATH_PREFIX}/book/search`, {
            params: {
                name: name,
                isb: isbn,
                author: author,
                category_id: category_id,
                page: page
            }
        })

        return data;
    }
}

export const searchService = new SearchService();