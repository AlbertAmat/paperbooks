<template>
	<page-component :model="controller">
		<template v-slot:append>
			<template v-if="activeTab === 'customers'">
				<return-books-dialog @refresh="reloadCustomers()"/>

				<v-btn
					@click="createCustomer()"
					class="text-none ml-3"
					color="primary"
					small
					variant="elevated"
				>
					{{t(AppLabels.ADD)}}
				</v-btn>
			</template>

			<v-btn
				v-else
				@click="groupsTree?.createGroup()"
				class="text-none ml-3"
				color="primary"
				small
				variant="elevated"
			>
				{{t(AppLabels.ADD)}}
			</v-btn>
		</template>

		<template v-slot:default>
			<v-tabs v-model="activeTab" density="compact" class="mb-4" color="primary">
				<v-tab value="customers" class="text-none">{{t(AppLabels.CUSTOMERS)}}</v-tab>
				<v-tab value="groups"  class="text-none">{{t(AppLabels.GROUPS)}}</v-tab>
			</v-tabs>

			<v-window v-model="activeTab" style="flex: 1; height: 100%; display: flex; flex-direction: column">
				<v-window-item value="customers" style="flex: 1; display: flex; flex-direction: column">
					<empty-state
						v-if="customers.length === 0"
						icon="mdi-account-plus-outline"
						:chip-icons="['mdi-account-outline', 'mdi-account-group-outline', 'mdi-book-account-outline', 'mdi-account-heart-outline', 'mdi-book-outline', 'mdi-account-edit-outline', 'mdi-account-multiple-outline', 'mdi-book-open-page-variant']"
						:title="t(AppLabels.EMPTY_CUSTOMERS_TITLE)"
						:description="t(AppLabels.EMPTY_CUSTOMERS_DESC)"
					>
						<v-btn
							@click="createCustomer()"
							class="text-none"
							color="primary"
							small
							variant="elevated"
						>
							{{t(AppLabels.ADD)}}
						</v-btn>
					</empty-state>

					<v-data-table-virtual
						v-else
						:headers="headers"
						density="compact"
						show-expand
						item-value="id"
						:items="customers"
					>
						<template v-slot:item.totalBooks="{ item }">
							<v-chip density="compact">{{ item.totalBooks }}</v-chip>
						</template>

						<template v-slot:item.groupName="{ item }">
							<v-chip v-if="item.groupName" density="compact">{{ item.groupName }}</v-chip>
							<span v-else class="text-medium-emphasis">{{ t(AppLabels.NO_GROUP) }}</span>
						</template>

						<template v-slot:item.actions="{ item }">
							<v-icon
								@click="editCustomer(item.id)"
								small
								class="mx-1"
							>
								mdi-pencil
							</v-icon>
							<v-btn
								icon
								variant="text"
								density="compact"
								@click="deleteItem(item.id)"
								:loading="deleteLoading.includes(item.id)"
								:disabled="deleteLoading.includes(item.id)"
								class="mx-1"
							>
								<v-icon
									small
									color="red"
								>
									mdi-delete
								</v-icon>
							</v-btn>
						</template>

						<template v-slot:expanded-row="{ columns, item }">
							<tr>
								<td :colspan="columns.length" class="py-2">
									<v-sheet rounded="lg" border>
										<customer-books-table :customer="controller.getCustomer(item.id)"/>
									</v-sheet>
								</td>
							</tr>
						</template>
					</v-data-table-virtual>
				</v-window-item>

				<v-window-item value="groups">
					<customer-groups-tree
						ref="groupsTree"
						:groups-controller="groupsController"
						:customers-controller="controller"
					/>
				</v-window-item>
			</v-window>

			<customer-dialog
				v-if="dialog"
				v-model="dialog"
				:customer="selectedCustomer"
				:controller="controller"
				:groups-controller="groupsController"
			/>
		</template>
	</page-component>
</template>

<script setup lang="ts">
/**
 * Customers management view: two tabs - an expandable data table of
 * customers (expanding a row shows their loaned books via
 * `CustomerBooksTable`) with inline edit/delete, and a groups tab
 * (`CustomerGroupsTree`). Runs `CustomersController` and
 * `CustomerGroupsController` side by side since both tabs share one page.
 */
import PageComponent from "@/views/PageComponent.vue";
import {computed, ref, Ref, ShallowRef, shallowRef} from "vue";
import CustomerDialog from "@/views/customers/components/CustomerDialog.vue";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import CustomersController from "@/controller/customers/CustomersController";
import CustomerGroupsController from "@/controller/customers/CustomerGroupsController";
import Customer from "@/model/customer/Customer";
import CustomerBooksTable from "@/views/customers/components/CustomerBooksTable.vue";
import EmptyState from "@/components/emptyState/EmptyState.vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import ReturnBooksDialog from "@/views/customers/components/ReturnBooksDialog.vue";
import CustomerGroupsTree from "@/views/customers/components/CustomerGroupsTree.vue";
import CustomerDetail from "@/model/customer/CustomerDetail";

const controller = new CustomersController();
const groupsController = new CustomerGroupsController();

const {t} = useI18n();

/**
 *
 */
const activeTab: Ref<string> = ref("customers");

/**
 *
 */
const groupsTree: ShallowRef<InstanceType<typeof CustomerGroupsTree> | null> = shallowRef(null);

/**
 *
 */
const dialog: Ref<boolean> = ref(false);

/**
 *
 */
const selectedCustomer: ShallowRef<CustomerDetail | undefined> = shallowRef(undefined);

/**
 *
 */
const deleteLoading: Ref<number[]> = ref([]);

const headers = [
	{
		title: t(AppLabels.NAME),
		value: 'name',
	},
	{
		title: t(AppLabels.TOTAL_BOOKS),
		value: 'tags',
	},
	{
		title: t(AppLabels.TAGS),
		value: 'totalBooks',
	},
	{
		title: t(AppLabels.GROUP),
		value: 'groupName',
	},
	{
		title: t(AppLabels.ACTIONS),
		value: 'actions',
		align: 'end',}
];

/**
 *
 */
const customers = computed(() => {
	return controller.getCustomers().map(customer => {
		return {
			id: customer.getCustomerId(),
			name: customer.getCustomerName(),
			tags: customer.getTags(),
			totalBooks: customer.getTotalBooks(),
			groupName: customer.getGroupName()
		}
	})
})

/**
 *
 * @param customerId
 */
function editCustomer(customerId: number) {
	const customer =  controller.getCustomers().find(customer => customer.getCustomerId() === customerId);
	if(customer) {
		selectedCustomer.value = customer;
		dialog.value = true;
	}
}

/**
 *
 */
function createCustomer() {
	selectedCustomer.value = undefined;
	dialog.value = true;
}

/**
 *
 * @param customerId
 */
async function deleteItem(customerId: number) {
	const customer = controller.getCustomer(customerId);
	confirmationDialogController.showDialog(
		`${t(AppLabels.DELETE_CUSTOMER)} ${customer ? customer.getCustomerName() : ''}`,
		t(AppLabels.DELETE_CUSTOMER_DESC),
		t(AppLabels.DELETE)
	).then(async () => {
		try {
			deleteLoading.value.push(customerId);
			await controller.deleteCustomer(customerId);
		} finally {
			deleteLoading.value.splice(deleteLoading.value.indexOf(customerId), 1);
		}
	});
}

function reloadCustomers() {
	controller.reload();
}

</script>