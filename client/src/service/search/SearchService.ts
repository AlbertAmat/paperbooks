import {PATH_PREFIX} from "@/Constants";
import {ISearchResponse} from "@/types/search/ISearchResponse";
import axiosInstance from "@/plugins/axiosInstance";
import {SearchFilter} from "@/types/search/SearchFilter";

class SearchService {

    public async searchBooks(
        query: string | null,
        category_id: number | null,
        page: number,
        filters: SearchFilter[]
    ): Promise<ISearchResponse> {

        const {data} = await axiosInstance.get(`${PATH_PREFIX}/book/search`, {
            params: {
                query: query,
                category_id: category_id,
                page: page,
                filters: filters.join(",")
            }
        })

        return data;
    }
}

export const searchService = new SearchService();