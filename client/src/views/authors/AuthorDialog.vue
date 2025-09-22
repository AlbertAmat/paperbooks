<template>
	<v-dialog
		v-model="dialog"
		width="500"
	>
		<v-card>
			<v-card-title>
				{{ author ? 'Edit author' : 'Add author' }}
			</v-card-title>

			<v-divider></v-divider>

			<v-card-text>
				<v-text-field
					v-model="name"
					label="Name"
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
					Close
				</v-btn>
				<v-btn
					color="primary"
					variant="elevated"
					:disabled="name === null || (name != null && name.trim().length === 0) || loading"
					:loading="loading"
					@click="addAuthor()"
					class="text-none"
				>
					{{ author ? 'Update' : 'Add' }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import {computed, Ref, ref} from 'vue'
import CustomersController from "@/controller/customers/CustomersController";
import Customer from "@/model/customer/Customer";
import BookAuthor from "@/model/author/BookAuthor";
import AuthorsController from "@/controller/authors/AuthorsController";

interface Props {
	author?: BookAuthor,
	controller: AuthorsController,
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
const name: Ref<string> = ref(props.author ? props.author.getAuthorName() : "");

/**
 *
 *
 */
async function addAuthor() {
	try {
		loading.value = true;
		if (props.author) {
			await props.author.update(name.value)
		} else {
			await props.controller.addAuthor(name.value)
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