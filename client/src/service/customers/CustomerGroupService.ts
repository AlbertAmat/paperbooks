import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import {ICustomerGroup} from "@/types/customer/ICustomerGroup";

/**
 * Thin HTTP client for the `/api/rest/customer/group` endpoints and the
 * customer<->group assignment endpoints (see server/src/routes/CustomerRoute.ts).
 *
 * @example
 * const groups = await customerGroupService.getGroups();
 * await customerGroupService.assignCustomerToGroup(7, groups[0].id);
 */
class CustomerGroupService {

    /** @returns Every customer group, with each group's member count. */
    public async getGroups(): Promise<ICustomerGroup[]> {
        const {data} = await axiosInstance.get(
            `${PATH_PREFIX}/customer/group`
        );

        return data;
    }

    /**
     * Create a new customer group.
     * @param name New group's name.
     * @param description New group's description, optional.
     * @returns The created group.
     */
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

    /**
     * Rename/update a customer group's description.
     * @param id Group id to update.
     * @param name New group name.
     * @param description New group description, optional.
     * @returns The updated group.
     */
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

    /**
     * Delete a customer group (members are kept, ungrouped).
     * @param id Group id to delete.
     */
    public async deleteGroup(id: number): Promise<void> {
        await axiosInstance.delete(
            `${PATH_PREFIX}/customer/group/${id}`
        );
    }

    /**
     * Assign a customer to a group.
     * @param customerId Customer id to assign.
     * @param groupId Group id to assign the customer to.
     */
    public async assignCustomerToGroup(
        customerId: number,
        groupId: number
    ): Promise<void> {
        await axiosInstance.put(
            `${PATH_PREFIX}/customer/${customerId}/group/${groupId}`
        );
    }

    /**
     * Remove a customer from whichever group they're in.
     * @param customerId Customer id to unassign.
     */
    public async removeCustomerFromGroup(
        customerId: number
    ): Promise<void> {
        await axiosInstance.delete(
            `${PATH_PREFIX}/customer/${customerId}/group`
        );
    }
}

/** Singleton instance shared by every part of the app. */
export const customerGroupService = new CustomerGroupService();
