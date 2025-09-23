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
				<v-text-field
					v-model="name"
					:label="t(AppLabels.NAME)"
					density="compact"
					variant="outlined"
					hide-details
				></v-text-field>
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
import Customer from "@/model/customer/Customer";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

interface Props {
	customer?: Customer,
	controller: CustomersController,
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
 *
 */
async function addCustomer() {
	try {
		loading.value = true;
		if (props.customer) {
			await props.customer.update(name.value)
		} else {
			await props.controller.addCustomer(name.value)
		}
		closeDialog();
	} finally {
		loading.value = false;
	}
}

/**
 *
 */
function closeDialog() {
	name.value = "";
	dialog.value = false;
}
</script>