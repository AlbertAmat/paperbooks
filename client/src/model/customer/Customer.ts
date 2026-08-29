/**
 * View model for a customer: name plus optional group membership, with
 * reactive rename and group-assignment operations backed by
 * `CustomersService`/`CustomerGroupService`.
 */
import {Ref, ref} from "vue";
import ICustomer from "@/types/customer/ICustomer";
import {customersService} from "@/service/customers/CustomersService";
import {customerGroupService} from "@/service/customers/CustomerGroupService";

export default class Customer {
    protected readonly m_customerId: number;
    private readonly m_customerName: Ref<string>;
    private readonly m_groupId: Ref<number | null>;
    private readonly m_groupName: Ref<string | null>;

    public constructor(data: ICustomer) {
        this.m_customerId = data.id;
        this.m_customerName = ref(data.name);
        this.m_groupId = ref(data.group_id);
        this.m_groupName = ref(data.group_name);
    }

    public getCustomerId(): number {
        return this.m_customerId;
    }

    public getCustomerName(): string {
        return this.m_customerName.value;
    }

    /** Rename this customer on the server and update local state. */
    public async update(name:string) {
        await customersService.updateCustomer(this.m_customerId, name);
        this.m_customerName.value = name;
    }

    public getGroupId(): number | null {
        return this.m_groupId.value;
    }

    public getGroupName(): string | null {
        return this.m_groupName.value;
    }

    /** Assign this customer to a group on the server and update local state. */
    public async assignToGroup(groupId: number, groupName: string) {
        await customerGroupService.assignCustomerToGroup(this.m_customerId, groupId);
        this.m_groupId.value = groupId;
        this.m_groupName.value = groupName;
    }

    /** Remove this customer from their current group, on the server and locally. */
    public async removeFromGroup() {
        await customerGroupService.removeCustomerFromGroup(this.m_customerId);
        this.m_groupId.value = null;
        this.m_groupName.value = null;
    }
}