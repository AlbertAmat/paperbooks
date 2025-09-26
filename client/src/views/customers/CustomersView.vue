<template>
	<page-component :model="controller">
		<template v-slot:append>
			<return-books-dialog @refresh="reloadCustomers()"/>

			<v-btn
				@click="createCustomer()"
				class="text-none"
				color="primary"
				small
				variant="elevated"
			>
				{{t(AppLabels.ADD)}}
			</v-btn>
		</template>

		<template v-slot:default>
			<v-data-table-virtual
				:headers="headers"
				density="compact"
				show-expand
				item-value="id"
				:items="customers"
			>
				<template v-slot:item.totalBooks="{ item }">
					<v-chip density="compact">{{ item.totalBooks }}</v-chip>
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

			<customer-dialog
				v-if="dialog"
				v-model="dialog"
				:customer="selectedCustomer"
				:controller="controller"
			/>
		</template>
	</page-component>
</template>

<script setup lang="ts">
import PageComponent from "@/views/PageComponent.vue";
import {computed, ref, Ref, ShallowRef, shallowRef} from "vue";
import CustomerDialog from "@/views/customers/CustomerDialog.vue";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import CustomersController from "@/controller/customers/CustomersController";
import Customer from "@/model/customer/Customer";
import CustomerBooksTable from "@/views/customers/CustomerBooksTable.vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import ReturnBooksDialog from "@/views/customers/ReturnBooksDialog.vue";

const controller = new CustomersController();

const {t} = useI18n();

/**
 *
 */
const dialog: Ref<boolean> = ref(false);

/**
 *
 */
const selectedCustomer: ShallowRef<Customer | undefined> = shallowRef(undefined);

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
		value: 'totalBooks',
	},
	{title: t(AppLabels.ACTIONS), value: 'actions', align: 'end',}
];

/**
 *
 */
const customers = computed(() => {
	return controller.getCustomers().map(customer => {
		return {
			id: customer.getCustomerId(),
			name: customer.getCustomerName(),
			totalBooks: customer.getTotalBooks()
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