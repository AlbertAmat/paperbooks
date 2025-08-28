<template>
	<page-component :model="controller">
		<template v-slot:append>
			<v-btn
				@click="createCustomer()"
				class="text-none gradient"
				color="primary"
				small
			>
				Add
			</v-btn>
		</template>

		<template v-slot:default>
			<v-data-table-virtual
				:headers="headers"
				density="compact"
				:items="customers"
			>
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

const controller = new CustomersController();

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
		title: 'Name',
		value: 'name',
	},
	{title: 'Actions', value: 'actions', align: 'end',}
];

/**
 *
 */
const customers = computed(() => {
	return controller.getCustomers().map(customer => {
		return {
			id: customer.getCustomerId(),
			name: customer.getCustomerName(),
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
		`Delete customer ${customer ? customer.getCustomerName() : ''}`,
		"Are you sure that you want to remove this customer?",
		"Delete"
	).then(async () => {
		try {
			deleteLoading.value.push(customerId);
			await controller.deleteCustomer(customerId);
		} finally {
			deleteLoading.value.splice(deleteLoading.value.indexOf(customerId), 1);
		}
	});
}
</script>