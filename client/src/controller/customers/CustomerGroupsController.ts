/**
 * Loads and manages customer groups for the customers view. Standalone
 * (doesn't extend `BaseController`) since it's used alongside
 * `CustomersController` on the same page rather than as its own route.
 */
import {Ref, ref, ShallowRef, shallowRef} from "vue";
import {ICustomerGroup} from "@/types/customer/ICustomerGroup";
import CustomerGroup from "@/model/customer/CustomerGroup";
import {customerGroupService} from "@/service/customers/CustomerGroupService";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

export default class CustomerGroupsController {

    /**
     * Stores the list of customer groups
     * @private
     */
    private m_groups: ShallowRef<CustomerGroup[]> = shallowRef([]);

    /**
     *
     * @private
     */
    private m_loading: Ref<boolean> = ref(false);

    public constructor() {
        this.reload();
    }

    /** (Re)fetch every customer group from the server. */
    public async reload() {
        try {
            this.m_loading.value = true;
            const data: ICustomerGroup[] = await customerGroupService.getGroups();
            this.m_groups.value = data.map(group => new CustomerGroup(group));
        } catch (e) {
            console.error("Error while fetching customer groups. ", e);
        } finally {
            this.m_loading.value = false;
        }
    }

    /**
     *
     */
    public isLoading(): boolean {
        return this.m_loading.value;
    }

    /**
     *
     */
    public getGroups(): CustomerGroup[] {
        return this.m_groups.value;
    }

    /**
     *
     */
    public getGroup(id: number | null): CustomerGroup | undefined {
        if (!id) {
            return undefined;
        }
        return this.m_groups.value.find(group => group.getId() === id);
    }

    /**
     *
     * @param name
     * @param description
     */
    public async addGroup(name: string, description?: string) {
        try {
            const group = await customerGroupService.addGroup(name, description);
            this.m_groups.value = [...this.m_groups.value, new CustomerGroup(group)];
            appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_NEW_GROUP_ADDED)})
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @param id
     */
    public async deleteGroup(id: number) {
        const index = this.m_groups.value.findIndex(group => group.getId() === id);
        if (index != -1) {
            try {
                await customerGroupService.deleteGroup(id);
                this.m_groups.value.splice(index, 1);
                this.m_groups.value = [...this.m_groups.value];
                appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_DELETED_GROUP)})
            } catch (e) {
                console.error(e);
            }
        }
    }
}
