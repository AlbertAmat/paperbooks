import axios from "axios";
import {PATH_PREFIX} from "@/Constants";
import IBook from "@/types/book/IBook";
import {BookStockStatusEnum, IBookStock} from "@/types/book/IBookStock";

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
     */
    public async updateBook(
        id: number,
        name: string,
        image_url: string | null,
        isbn: string | null,
        category_id: number | null,
        language_code: string | null,
        authors: number[],
        description: string | null,
        publisher: string | null,
        published_date: Date | null,
        pages: number,
        format_id: number | null
    ): Promise<void> {
        const {data} = await axios.put(`${PATH_PREFIX}/book/${id}`, {
            name: name,
            image_url,
            isbn,
            category_id: category_id,
            language_code: language_code,
            authors: authors,
            description: description,
            publisher: publisher,
            published_date: published_date,
            pages: pages,
            format_id: format_id
        });
        return data;
    }

    /**
     *
     * @param isbn
     */
    public async createBookFromIsbn(isbn: string): Promise<number> {
        const {data} = await axios.post(`${PATH_PREFIX}/book/isbn/${isbn}`, {});
        return data;
    }

    /**
     *
     * @param id
     * @param status
     * @param print
     */
    public async addBookStock(id: number, locationId: number, status: BookStockStatusEnum): Promise<IBookStock> {
        const {data} = await axios.post(`${PATH_PREFIX}/book/${id}/stock`, {
            status: status,
            location_id: locationId
        });

        return data;
    }

    /**
     *
     * @param id
     * @param stockId
     */
    public async removeBookStock(id: number, stockId: number): Promise<boolean> {
        const {data} = await axios.delete(`${PATH_PREFIX}/book/${id}/stock/${stockId}`);

        return data;
    }


    /**
     *
     * @param id
     * @param stockId
     * @param stockStatus
     * @param stockLocationId
     */
    public async updateBookStock(id: number, stockId: number, stockStatus: BookStockStatusEnum, stockLocationId: number): Promise<IBookStock> {
        const {data} = await axios.put(`${PATH_PREFIX}/book/${id}/stock/${stockId}`, {
            status: stockStatus,
            location_id: stockLocationId
        });

        return data;
    }


    /**
     *
     * @param id
     */
    public async deleteBook(id: number): Promise<void> {
        await axios.delete(`${PATH_PREFIX}/book/${id}`);
    }

}

export const bookService = new BookService();