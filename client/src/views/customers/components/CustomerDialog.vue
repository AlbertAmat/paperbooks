<template>
	<v-dialog
		v-model="dialog"
		width="500"
	>
		<v-card>
			<v-card-title>
				{{ customer ? t(AppLabels.EDIT_CUSTOMER) : t(AppLabels.ADD_CUSTOMER) }}
			</v-card-title>

			<v-divider></v-divider>

			<v-card-text>
				<v-alert
					v-if="applicationService.getUser().isPublicInstitution()"
					color="primary"
					variant="tonal"
					density="compact"
					icon="mdi-shield-alert-outline"
					style="font-size: 13px"
					class="mb-4"
				>
					{{ t(AppLabels.PUBLIC_INSTITUTION_SENSITIVE_DATA_WARNING) }}
				</v-alert>

				<v-text-field
					v-model="name"
					:label="t(AppLabels.NAME)"
					density="compact"
					variant="outlined"
					autofocus
					hide-details
					class="mb-4"
				></v-text-field>
				<v-select
					v-model="selectedGroupId"
					:items="groupItems"
					item-title="title"
					item-value="value"
					:label="t(AppLabels.GROUP)"
					density="compact"
					variant="outlined"
					clearable
					hide-details
				></v-select>
			</v-card-text>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					variant="text"
					@click="closeDialog()"
					class="text-none"
				>
					{{t(AppLabels.CLOSE)}}
				</v-btn>
				<v-btn
					color="primary"
					variant="elevated"
					:disabled="name === null || (name != null && name.trim().length === 0) || loading"
					:loading="loading"
					@click="addCustomer()"
					class="text-none"
				>
					{{ customer ? t(AppLabels.UPDATE) : t(AppLabels.ADD) }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import {computed, Ref, ref} from 'vue'
import CustomersController from "@/controller/customers/CustomersController";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import CustomerDetail from "@/model/customer/CustomerDetail";
import CustomerGroupsController from "@/controller/customers/CustomerGroupsController";
import {applicationService} from "@/service/ApplicationService";

interface Props {
	customer?: CustomerDetail,
	controller: CustomersController,
	groupsController: CustomerGroupsController,
	modelValue: boolean
}

const props = defineProps<Props>();

const {t} = useI18n();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

/**
 *
 */
const dialog = computed({
	get: () => props.modelValue,
	set: (val: boolean) => emit('update:modelValue', val),
})

/**
 *
 */
const loading: Ref<boolean> = ref(false);

/**
 *
 */
const name: Ref<string> = ref(props.customer ? props.customer.getCustomerName() : "");

/**
 *
 */
const selectedGroupId: Ref<number | null> = ref(props.customer ? props.customer.getGroupId() : null);

/**
 *
 */
const groupItems = computed(() => {
	return props.groupsController.getGroups().map(group => {
		return {title: group.getName(), value: group.getId()}
	})
})

/**
 *
 *
 */
async function addCustomer() {
	try {
		loading.value = true;
		if (props.customer) {
			await props.customer.update(name.value)
			await applyGroupChange(props.customer)
		} else {
			const group = selectedGroupId.value != null ? props.groupsController.getGroup(selectedGroupId.value) : undefined;
			await props.controller.addCustomer(name.value, group)
		}
		closeDialog();
	} finally {
		loading.value = false;
	}
}

/**
 * Applies a group selection change to an existing customer, keeping
 * each group's customer count in sync.
 *
 * @param customer
 */
async function applyGroupChange(customer: CustomerDetail) {
	const previousGroupId = customer.getGroupId();
	const newGroupId = selectedGroupId.value;

	if (previousGroupId === newGroupId) {
		return;
	}

	if (newGroupId != null) {
		const newGroup = props.groupsController.getGroup(newGroupId);
		if (newGroup) {
			await customer.assignToGroup(newGroup.getId(), newGroup.getName())
			newGroup.incrementTotalCustomers();
		}
	} else {
		await customer.removeFromGroup()
	}

	if (previousGroupId != null) {
		props.groupsController.getGroup(previousGroupId)?.decrementTotalCustomers();
	}
}

/**
 *
 */
function closeDialog() {
	name.value = "";
	selectedGroupId.value = null;
	dialog.value = false;
}
</script>