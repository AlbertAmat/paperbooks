import {Ref, ref} from "vue";
import {ICustomerGroup} from "@/types/customer/ICustomerGroup";
import {customerGroupService} from "@/service/customers/CustomerGroupService";

export default class CustomerGroup {
    /**
     *
     * @private
     */
    private readonly m_id: number;

    /**
     *
     * @private
     */
    private readonly m_name: Ref<string>;

    /**
     *
     * @private
     */
    private readonly m_description: Ref<string | undefined>;

    /**
     *
     * @private
     */
    private readonly m_totalCustomers: Ref<number>;

    public constructor(data: ICustomerGroup) {
        this.m_id = data.id;
        this.m_name = ref(data.name);
        this.m_description = ref(data.description);
        this.m_totalCustomers = ref(data.total_customers ?? 0);
    }

    /**
     *
     */
    public getId(): number {
        return this.m_id;
    }

    /**
     *
     */
    public getName(): string {
        return this.m_name.value;
    }

    /**
     *
     */
    public getDescription(): string | undefined {
        return this.m_description.value;
    }

    /**
     *
     */
    public getTotalCustomers(): number {
        return this.m_totalCustomers.value;
    }

    /**
     *
     * @param name
     * @param description
     */
    public async update(name: string, description?: string) {
        await customerGroupService.updateGroup(this.m_id, name, description);
        this.m_name.value = name;
        this.m_description.value = description;
    }

    /**
     *
     */
    public incrementTotalCustomers() {
        this.m_totalCustomers.value += 1;
    }

    /**
     *
     */
    public decrementTotalCustomers() {
        this.m_totalCustomers.value = Math.max(0, this.m_totalCustomers.value - 1);
    }
}
