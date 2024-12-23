<template>
	<v-card class="mx-1 mb-3">
		<v-card-title>
			<v-icon class="mr-2">mdi-map-marker-radius-outline</v-icon>

			Locations
		</v-card-title>
		<v-card-text>
			<v-data-table
				:headers="headers"
				:items="locations"
				:items-per-page="5"
				dense
			></v-data-table>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, Ref} from 'vue'
import Book from "@/model/book/Book";
import {IBookLocation} from "@/types/book/IBookLocation";
import {bookService} from "@/service/book/BookService";

export default defineComponent({
	name: "BookLocations",
	props: {
		book: {
			type: Object as () => Book,
			required: true
		}
	},
	setup(props) {

		const loading: Ref<boolean> = ref(false);
		const locations: Ref<IBookLocation[]> = ref([]);

		const headers = [
			{
				text: 'Location',
				align: 'start',
				sortable: false,
				value: 'location_name',
			},
			{text: 'Quantity', value: 'quantity'},
		];

		/**
		 *
		 */
		async function getBookLocations() {
			try {
				loading.value = true;
				locations.value = await bookService.getBookLocations(props.book.getId())
			} finally {
				loading.value = false;
			}
		}

		onMounted(() => {
			getBookLocations()
		})

		return {
			headers,
			loading,
			locations
		}
	}
})
</script>

<style scoped lang="scss">

</style>