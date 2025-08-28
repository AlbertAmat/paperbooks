<template>
	<v-dialog
		v-model="dialog"
		width="500"
	>
		<v-card>
			<v-card-title>
				{{ category ? 'Edit category' : 'Add category' }}
			</v-card-title>

			<v-divider></v-divider>

			<v-card-text>
				<v-text-field
					v-model="name"
					label="Name"
					density="compact"
					variant="outlined"
					hide-details
					class="mb-4"
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
					Close
				</v-btn>
				<v-btn
					color="primary"
					variant="elevated"
					:disabled="name === null || (name != null && name.trim().length === 0) || loading"
					:loading="loading"
					@click="addCategory()"
					class="text-none"
				>
					{{ category ? 'Update' : 'Add' }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import {computed, Ref, ref} from 'vue'
import {applicationService} from "@/service/ApplicationService";
import Category from "@/model/category/Category";
import CategoriesController from "@/controller/categories/CategoriesController";

interface Props {
	category?: Category,
	controller: CategoriesController,
	modelValue: boolean
}

const props = defineProps<Props>()

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
const name: Ref<string> = ref(props.category ? props.category.getCategoryName() : "");

/**
 *
 *
 */
async function addCategory() {
	try {
		loading.value = true;
		if (props.category) {
			await props.category.update(name.value)
		} else {
			await props.controller.addCategory(name.value)
		}
		applicationService.setCategories(props.controller.getCategories())
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