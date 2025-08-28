
import {BaseController} from "@/controller/BaseController";
import {ShallowRef, shallowRef} from "vue";
import ICustomer from "@/types/customer/ICustomer";
import Customer from "@/model/customer/Customer";
import {customersService} from "@/service/customers/CustomersService";

export default class CustomersController extends BaseController<ICustomer[]> {

    /**
     *
     * @private
     */
    private m_customers: ShallowRef<Customer[]> = shallowRef([]);

    public constructor() {
        super("Customers");
    }

    async fetchData(): Promise<ICustomer[]> {
        return await customersService.getCustomers()
    }

    setData(data: ICustomer[]) {
        this.m_customers.value = data.map(customer => new Customer(customer));
    }

    /**
     *
     */
    public getCustomers(): Customer[] {
        return this.m_customers.value;
    }

    /**
     *
     */
    public getCustomer(id: number): Customer | undefined {
        return this.m_customers.value.find(customer => customer.getCustomerId() === id);
    }

    /**
     *
     * @param name
     */
    public async addCustomer(name: string) {
        try {
            const customer = await customersService.addCustomer(name);
            this.m_customers.value = [...this.m_customers.value, new Customer(customer)];
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @param customerId
     */
    public async deleteCustomer(customerId: number) {
        const index = this.m_customers.value.findIndex(customer => customer.getCustomerId() === customerId);
        if(index != -1 ) {
            try {
                await customersService.deleteCustomer(customerId);
                this.m_customers.value.splice(index, 1);
                this.m_customers.value = [...this.m_customers.value];
            } catch (e) {
                console.error(e);
            }
        }
    }
}