import axios from "axios";
import {PATH_PREFIX} from "@/Constants";
import IBookAuthor from "@/types/book/IBookAuthor";
import axiosInstance from "@/plugins/axiosInstance";
import ICustomer from "@/types/customer/ICustomer";
import ILocation from "@/types/location/ILocation";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";

export class AuthorsService {

    /**
     *
     * @param query
     */
    public async searchAuthors(query: string): Promise<IBookAuthor[]> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/author/search`, {
            query: query
        });
        return data;
    }

    public async getAuthors(): Promise<IBookAuthor[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/author`)
        return data;
    }

    public async updateAuthor(id: number, name: string) {
        await axiosInstance.put(`${PATH_PREFIX}/author/${id}`, {
            name: name,
        })
    }

    public async addAuthor(name: string): Promise<IBookAuthor> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/author`, {
            name: name,
        })

        return data;
    }

    public async deleteAuthor(id: number): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/author/${id}`)
    }

}

export const authorsService = new AuthorsService();