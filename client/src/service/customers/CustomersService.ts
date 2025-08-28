import {PATH_PREFIX} from "@/Constants";
import {ISearchResponse} from "@/types/search/ISearchResponse";
import axiosInstance from "@/plugins/axiosInstance";
import ILocation from "@/types/location/ILocation";
import ICustomer from "@/types/customer/ICustomer";

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
}

export const customersService = new CustomersService();