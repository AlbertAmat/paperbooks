import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import {ICustomerGroup} from "@/types/customer/ICustomerGroup";

class CustomerGroupService {

    public async getGroups(): Promise<ICustomerGroup[]> {
        const {data} = await axiosInstance.get(
            `${PATH_PREFIX}/customer/group`
        );

        return data;
    }

    public async addGroup(
        name: string,
        description?: string
    ): Promise<ICustomerGroup> {
        const {data} = await axiosInstance.post(
            `${PATH_PREFIX}/customer/group`,
            {
                name,
                description
            }
        );

        return data;
    }

    public async updateGroup(
        id: number,
        name: string,
        description?: string
    ): Promise<ICustomerGroup> {
        const {data} = await axiosInstance.put(
            `${PATH_PREFIX}/customer/group/${id}`,
            {
                name,
                description
            }
        );

        return data;
    }

    public async deleteGroup(id: number): Promise<void> {
        await axiosInstance.delete(
            `${PATH_PREFIX}/customer/group/${id}`
        );
    }

    public async assignCustomerToGroup(
        customerId: number,
        groupId: number
    ): Promise<void> {
        await axiosInstance.put(
            `${PATH_PREFIX}/customer/${customerId}/group/${groupId}`
        );
    }

    public async removeCustomerFromGroup(
        customerId: number
    ): Promise<void> {
        await axiosInstance.delete(
            `${PATH_PREFIX}/customer/${customerId}/group`
        );
    }
}

export const customerGroupService = new CustomerGroupService();