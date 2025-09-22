import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import ILocation from "@/types/location/ILocation";
import ICustomer from "@/types/customer/ICustomer";
import {ICustomerBook} from "@/types/customer/ICustomerBook";

class CustomersService {

    public async getCustomers(): Promise<ICustomer[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/customer`)
        return data;
    }

    public async updateCustomer(id: number, name: string) {
        await axiosInstance.put(`${PATH_PREFIX}/customer/${id}`, {
            name: name,
        })
    }

    public async addCustomer(name: string): Promise<ILocation> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/customer`, {
            name: name,
        })

        return data;
    }

    public async deleteCustomer(customerId: number): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/customer/${customerId}`)
    }

    public async getCustomerBooks(customerId:number): Promise<ICustomerBook[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/customer/${customerId}/books`);
        return data;
    }

    /**
     *
     * @param customerId
     * @param books: array of book stock code
     */
    public async addBooks(customerId: number, books: string[]): Promise<ICustomerBook[]> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/customer/${customerId}/add/books`, {books: books});
        return data;
    }

    /**
     * Remove a book from a customer
     * @param customerId
     */
    public async removeCustomerBook(customerId: number, bookStockCode: string): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/customer/${customerId}/book/${bookStockCode}`);
    }
}

export const customersService = new CustomersService();