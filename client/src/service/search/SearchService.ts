import {PATH_PREFIX} from "@/Constants";
import {ISearchResponse} from "@/types/search/ISearchResponse";
import axiosInstance from "@/plugins/axiosInstance";

class SearchService {

    public async searchBooks(
        query: string | null,
        isbn: string | null,
        author: string | null,
        category_id: number | null,
        page: number
    ): Promise<ISearchResponse> {

        const {data} = await axiosInstance.get(`${PATH_PREFIX}/book/search`, {
            params: {
                query: query,
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