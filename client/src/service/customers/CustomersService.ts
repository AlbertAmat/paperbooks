import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import {ICustomerDetail} from "@/types/customer/ICustomer";
import {ICustomerBook} from "@/types/customer/ICustomerBook";
import {ICustomersResponse} from "@/types/customer/ICustomersResponse";

/**
 * Thin HTTP client for the `/api/rest/customer` endpoints (see server/src/routes/CustomerRoute.ts):
 * customer CRUD and lending/returning books to a customer.
 *
 * @example
 * const {customers, tags} = await customersService.getPageData();
 * await customersService.addBooks(customers[0].id, ["a1b2c3d4e5"]);
 */
class CustomersService {

    /** Fetch the customers list view's data: all customers plus all available tags. */
    public async getPageData(): Promise<ICustomersResponse> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/customer`)
        return data;
    }

    /** Rename a customer. */
    public async updateCustomer(id: number, name: string) {
        await axiosInstance.put(`${PATH_PREFIX}/customer/${id}`, {
            name: name,
        })
    }

    /** Create a new customer. */
    public async addCustomer(name: string): Promise<ICustomerDetail> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/customer`, {
            name: name,
        })

        return data;
    }

    /** Delete a customer. */
    public async deleteCustomer(customerId: number): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/customer/${customerId}`)
    }

    /** List the books currently on loan to a customer. */
    public async getCustomerBooks(customerId:number): Promise<ICustomerBook[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/customer/${customerId}/books`);
        return data;
    }

    /**
     * Lend a batch of book stocks to a customer.
     * @param customerId Customer id.
     * @param books Array of book stock codes.
     */
    public async addBooks(customerId: number, books: string[]): Promise<ICustomerBook[]> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/customer/${customerId}/add/books`, {books: books});
        return data;
    }

    /**
     * Return a single book a customer had on loan.
     * @param customerId Customer id.
     * @param bookStockCode The stock code being returned.
     */
    public async removeCustomerBook(customerId: number, bookStockCode: string): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/customer/${customerId}/book/${bookStockCode}`);
    }
}

export const customersService = new CustomersService();
