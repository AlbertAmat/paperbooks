<template>
	<v-data-table-virtual
		:headers="headers"
		density="compact"
		:items="books"
	>
		<template v-slot:top>
			<v-toolbar
				flat
				density="compact"
				class="px-3"
			>
				<v-spacer/>
				<v-btn
					@click="addDialog = true;"
					density="compact"
					color="primary"
					variant="tonal"
					prepend-icon="mdi-plus"
					:text="t(AppLabels.ADD_BOOK)"
					class="text-none"
				></v-btn>
			</v-toolbar>
		</template>

		<template v-slot:item.name="{item}">
			<router-link :to="item.url">
				{{item.name}}
			</router-link>
		</template>

		<template v-slot:item.image="{item}">
			<img
				v-if="item.image != null"
				:src="item.image"
				style="height: 55px; margin-right: 10px"
			/>
			<div
				v-else
				style="background-color: #f1f1f1; height: 55px; width: 30px; margin-right: 10px; display: flex; align-items: center; justify-content: center"
			>
				<v-icon>mdi-image-outline</v-icon>
			</div>
		</template>

		<template v-slot:item.action="{item}">
			<v-btn
				icon
				variant="text"
				density="compact"
				@click="removeCustomerBook(item.code)"
				:loading="removeLoading.includes(item.code)"
				:disabled="removeLoading.includes(item.code)"
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

	<customer-add-books-dialog
		v-if="addDialog"
		v-model="addDialog"
		:customer="customer"
	/>
</template>

<script setup lang="ts">
import {computed, onMounted, Ref, ref} from "vue";
import CustomerAddBooksDialog from "@/views/customers/components/CustomerAddBooksDialog.vue";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import {bookRoute} from "@/router/routes/BookRoute";
import CustomerDetail from "@/model/customer/CustomerDetail";

interface Props {
	customer: CustomerDetail
}

const props = defineProps<Props>();

const {t} = useI18n();

const loading: Ref<boolean> = ref(false);
const addDialog: Ref<boolean> = ref(false);

const removeLoading: Ref<string[]> = ref([]);

const headers = [
	{
		title: t(AppLabels.IMAGE),
		value: 'image',
	},
	{
		title: t(AppLabels.NAME),
		value: 'name',
	},
	{title: t(AppLabels.CODE), value: 'code'},
	{title: t(AppLabels.ACTIONS), value: 'action'},
];

const books = computed(() => {
	return props.customer.getBooks().map((book) => {
		return {
			image: book.getImageUrl(),
			id: book.getId(),
			name: book.getName(),
			code: book.getStockCode(),
			url: bookRoute.getPath(book.getId())
		}
	})
})

async function removeCustomerBook(bookStockCode: string) {
	confirmationDialogController.showDialog(
		t(AppLabels.REMOVE_BOOK),
		t(AppLabels.REMOVE_BOOK_DESC),
		t(AppLabels.DELETE)
	).then(async () => {
		try {
			removeLoading.value.push(bookStockCode);
			await props.customer.removeBook(bookStockCode)
		} finally {
			removeLoading.value.splice(removeLoading.value.indexOf(bookStockCode), 1);
		}
	})
}

onMounted(async () => {
	try {
		loading.value = true;
		await props.customer.fetchBooks();
	} finally {
		loading.value = false;
	}
})
</script>