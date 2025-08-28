import axios from "axios";
import {PATH_PREFIX} from "@/Constants";
import IBook from "@/types/book/IBook";
import {BookStockStatusEnum, IBookStock} from "@/types/book/IBookStock";
import axiosInstance from "@/plugins/axiosInstance";

export class BookService {

    /**
     *
     * @param isbn
     */
    public async getBook(id: number): Promise<IBook> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/book/${id}`, {});
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
        const {data} = await axiosInstance.put(`${PATH_PREFIX}/book/${id}`, {
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

    private fileToBase64(file: File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    public async createBook(
        name: string,
        description: string | null,
        isbn: string | null,
        image: File | null,
    ): Promise<number> {
        const formData = new FormData();
        formData.set("name", name);

        if(description) {
            formData.set("description", description);
        }

        if(isbn) {
            formData.set("isbn", isbn);
        }

        if(image) {
            formData.set("image", image);
        }

        const {data} = await axiosInstance.post(`${PATH_PREFIX}/book`, formData);
        return data;
    }

    /**
     *
     * @param isbn
     */
    public async createBookFromIsbn(isbn: string): Promise<void> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/book/isbn/${isbn}`, {});
        return data;
    }

    /**
     *
     * @param id
     * @param status
     * @param print
     */
    public async addBookStock(id: number, locationId: number, status: BookStockStatusEnum, customerId: number |null): Promise<IBookStock> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/book/${id}/stock`, {
            status: status,
            location_id: locationId,
            customer_id: customerId,
        });

        return data;
    }

    /**
     *
     * @param id
     * @param stockId
     */
    public async removeBookStock(id: number, stockId: number): Promise<boolean> {
        const {data} = await axiosInstance.delete(`${PATH_PREFIX}/book/${id}/stock/${stockId}`);

        return data;
    }

    /**
     *
     * @param id
     * @param stockId
     * @param stockStatus
     * @param stockLocationId
     */
    public async updateBookStock(id: number, stockId: number, stockStatus: BookStockStatusEnum, stockLocationId: number, customerId: number | null): Promise<IBookStock> {
        const {data} = await axiosInstance.put(`${PATH_PREFIX}/book/${id}/stock/${stockId}`, {
            status: stockStatus,
            location_id: stockLocationId,
            customer_id: customerId
        });

        return data;
    }

    /**
     *
     * @param id
     */
    public async deleteBook(id: number): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/book/${id}`);
    }

}

export const bookService = new BookService();