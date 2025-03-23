<template>
	<card-component
		title="Stocks"
		icon="mdi-book-multiple"
		:counter="stocks.length"
	>
		<template v-slot:actions>
			<add-book-stock :book="book"/>
		</template>

		<template v-slot:default>
			<v-data-table
				:headers="headers"
				:items="stocks"
				:items-per-page="20"
				dense
			>
				<template v-slot:item.status="{item}">
					<v-chip
						small
						outlined
						:color="item.status_color"
					>
						{{ item.status_text }}
					</v-chip>
				</template>

				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="printBarcode(item.id)"
						small
						class="mr-2"
					>
						mdi-barcode
					</v-icon>
					<v-icon
						small
						class="mr-2"
					>
						mdi-pencil
					</v-icon>
					<v-icon
						small
						color="red"
					>
						mdi-delete
					</v-icon>
				</template>
			</v-data-table>
		</template>
	</card-component>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue'
import Book from "@/model/book/Book";
import BookStock from "@/model/book/BookStock";
import AddBookStock from "@/components/book/details/compoents/AddBookStock.vue";
import CardComponent from "@/components/card/CardComponent.vue";

export default defineComponent({
	name: "BookStocks",
	components: {CardComponent, AddBookStock},
	props: {
		book: {
			type: Object as () => Book,
			required: true
		}
	},
	setup(props) {
		const headers = [
			{
				text: 'Code',
				align: 'start',
				sortable: false,
				value: 'code',
			},
			{text: 'Location', value: 'location_name'},
			{text: 'Status', value: 'status'},
			{text: 'Actions', value: 'actions', align: 'end',}
		];

		const stocks = computed(() => {
			return props.book.getStocks().map((stock) => {
				const status = BookStock.BookStockStatus.find((item) => item.value === stock.getStatus());

				return {
					id: stock.getId(),
					code: stock.getCode(),
					location_id: stock.getLocationId(),
					location_name: stock.getLocationName() || '[No location]',
					status: stock.getStatus(),
					status_color: status!.color,
					status_text: status!.text
				}
			})
		})

		function printBarcode(id: number) {
			const stock = props.book.getStocks().find((stock) => stock.getId() === id);
			if(stock) {
				stock.printBarcode()
			}
		}

		return {
			headers,
			stocks,
			printBarcode
		}
	}
})
</script>

<style scoped lang="scss">

</style>