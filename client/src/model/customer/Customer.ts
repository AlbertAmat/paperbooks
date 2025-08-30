import ICategory from "@/types/category/ICategory";
import {categoriesService} from "@/service/categories/CategoriesService";
import {Ref, ref} from "vue";
import ICustomer from "@/types/customer/ICustomer";
import {customersService} from "@/service/customers/CustomersService";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";

export default class Customer {
    /**
     *
     * @private
     */
    private readonly m_customerId: number;

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

    public async update(name: string) {
        await customersService.updateCustomer(this.m_customerId, name)
        this.m_customerName.value = name;
        appSnackbarController.show({message: "Customer updated successfully"})
    }
}