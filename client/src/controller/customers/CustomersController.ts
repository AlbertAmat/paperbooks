
import {BaseController} from "@/controller/BaseController";
import {ShallowRef, shallowRef} from "vue";
import ICustomer from "@/types/customer/ICustomer";
import Customer from "@/model/customer/Customer";
import {customersService} from "@/service/customers/CustomersService";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import {ICustomersResponse} from "@/types/customer/ICustomersResponse";
import {Tag} from "@/model/customer/Tag";
import CustomerDetail from "@/model/customer/CustomerDetail";

export default class CustomersController extends BaseController<ICustomersResponse> {

    /**
     * Stores the list of customers
     * @private
     */
    private m_customers: ShallowRef<CustomerDetail[]> = shallowRef([]);

    /**
     * Stores the list of tags
     * @private
     */
    private m_tags: ShallowRef<Tag[]> = shallowRef([]);

    public constructor() {
        super(i18n.global.t(AppLabels.CUSTOMERS));
    }

    async fetchData(): Promise<ICustomersResponse> {
        return await customersService.getPageData()
    }

    async reload() {
        await this.__fetchData();
    }

    setData(data: ICustomersResponse) {
        this.m_customers.value = data.customers.map(customer => new CustomerDetail(customer));
        this.m_tags.value = data.tags.map(tag => new Tag(tag));
    }

    /**
     *
     */
    public getCustomers(): CustomerDetail[] {
        return this.m_customers.value;
    }

    /**
     *
     */
    public getCustomer(id: number): CustomerDetail | undefined {
        return this.m_customers.value.find(customer => customer.getCustomerId() === id);
    }

    /**
     *
     */
    public getTags(): Tag[] {
        return this.m_tags.value;
    }

    /**
     *
     * @param id
     */
    public getTag(id: number): Tag | undefined {
        return this.m_tags.value.find(tag => tag.getId() == id);
    }

    /**
     *
     * @param name
     */
    public async addCustomer(name: string) {
        try {
            const customer = await customersService.addCustomer(name);
            this.m_customers.value = [...this.m_customers.value, new CustomerDetail(customer)];
            appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_NEW_CUSTOMER_ADDED)})
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
                appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_DELETED_CUSTOMER)})
            } catch (e) {
                console.error(e);
            }
        }
    }
}