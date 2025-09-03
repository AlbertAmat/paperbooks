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
					prepend-icon="mdi-plus"
					text="Add a Book"
					variant="elevated"
					class="text-none gradient"
				></v-btn>
			</v-toolbar>
		</template>

		<template v-slot:item.status="{item}">
			<v-chip
				density="compact"
				variant="outlined"
				:color="item.status_color"
			>
				{{ item.status_text }}
			</v-chip>
		</template>
	</v-data-table-virtual>

	<add-location-books
		v-if="addDialog"
		v-model="addDialog"
		:location="location"
	/>
</template>

<script setup lang="ts">
import {computed, onMounted, Ref, ref} from "vue";
import LocationExt from "@/model/location/LocationExt";
import BookStock from "@/model/book/BookStock";
import AddLocationBooks from "@/components/addBookStocks/AddLocationBooks.vue";

interface Props {
	location: LocationExt
}

const props = defineProps<Props>()

const loading: Ref<boolean> = ref(false);
const addDialog: Ref<boolean> = ref(false);

const headers = [
	{
		title: 'Name',
		value: 'name',
	},
	{title: 'Code', value: 'code'},
	{title: 'Status', value: 'status'},
];

const books = computed(() => {
	return props.location.getBooks().map((book) => {
		const status = BookStock.BookStockStatus.find((item) => item.value === book.getStockStatus());

		return {
			id: book.getBookId(),
			name: book.getBookName(),
			code: book.getStockCode(),
			status: book.getStockStatus(),
			status_color: status!.color,
			status_text: status!.text,
		}
	})
})

onMounted(async () => {
	if (props.location.getBooks().length == 0) {
		try {
			loading.value = true;
			await props.location.fetchBooks();
		} finally {
			loading.value = false;
		}
	}
})
</script>

<style scoped>

</style>