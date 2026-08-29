import {PATH_PREFIX} from "@/Constants";
import IBookAuthor from "@/types/book/IBookAuthor";
import axiosInstance from "@/plugins/axiosInstance";

/**
 * Thin HTTP client for the `/api/rest/author` endpoints (see server/src/routes/AuthorRoute.ts).
 *
 * @example
 * await authorsService.addAuthor("J.R.R. Tolkien");
 * const matches = await authorsService.searchAuthors("tolk");
 */
export class AuthorsService {

    /**
     * Case-insensitive substring search over the user's authors, for the
     * author picker/autocomplete when editing a book.
     * @param query Search text, e.g. "tolk".
     */
    public async searchAuthors(query: string): Promise<IBookAuthor[]> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/author/search`, {
            query: query
        });
        return data;
    }

    /** Fetch every author belonging to the user. */
    public async getAuthors(): Promise<IBookAuthor[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/author`)
        return data;
    }

    /** Rename an existing author. */
    public async updateAuthor(id: number, name: string) {
        await axiosInstance.put(`${PATH_PREFIX}/author/${id}`, {
            name: name,
        })
    }

    /** Create a new author and return the created record. */
    public async addAuthor(name: string): Promise<IBookAuthor> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/author`, {
            name: name,
        })

        return data;
    }

    /** Delete an author by id. */
    public async deleteAuthor(id: number): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/author/${id}`)
    }

}

export const authorsService = new AuthorsService();
