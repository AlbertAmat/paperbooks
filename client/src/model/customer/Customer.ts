import {Ref, ref, ShallowRef, shallowRef} from "vue";
import ICustomer from "@/types/customer/ICustomer";
import {customersService} from "@/service/customers/CustomersService";

export default class Customer {
    /**
     *
     * @private
     */
    protected readonly m_customerId: number;

    /**
     *
     * @private
     */
    private readonly m_customerName: Ref<string>;

    public constructor(data: ICustomer) {
        this.m_customerId = data.id;
        this.m_customerName = ref(data.name);
    }

    /**
     *
     */
    public getCustomerId(): number {
        return this.m_customerId;
    }

    /**
     *
     */
    public getCustomerName(): string {
        return this.m_customerName.value;
    }

    /**
     *
     * @param name
     */
    public async update(name:string) {
        await customersService.updateCustomer(this.m_customerId, name);
        this.m_customerName.value = name;
    }
}