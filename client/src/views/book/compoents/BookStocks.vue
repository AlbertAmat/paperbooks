<template>
	<card-component
		title="Stocks"
		icon="mdi-book-multiple"
		:counter="stocks.length"
	>
		<template v-slot:actions>
			<v-btn
				@click="showAddStockDialog"
				density="comfortable"
				color="primary"
				class="text-none"
			>
				Add
			</v-btn>
		</template>

		<template v-slot:default>
			<v-data-table
				:key="book.getStocks().length"
				:headers="headers"
				density="compact"
				:items="stocks"
			>

				<template v-slot:item.status="{item}">
					<v-chip
						density="compact"
						variant="outlined"
						:color="item.status_color"
					>
						{{ item.status_text }}
					</v-chip>
				</template>

				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="printBarcode(item.id)"
						small
						class="mx-1"
					>
						mdi-barcode
					</v-icon>
					<v-icon
						@click="showEditStockDialog(item.id)"
						small
						class="mx-1"
					>
						mdi-pencil
					</v-icon>
					<v-btn
						icon
						variant="text"
						density="compact"
						:loading="deleteLoading.includes(item.id)"
						:disabled="deleteLoading.includes(item.id)"
						@click="removeBookStock(item)"
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
			</v-data-table>

			<book-stock-dialog
				v-if="stockDialog"
				v-model="stockDialog"
				:book="book"
				:stock="selectedStock"
			/>
		</template>
	</card-component>
</template>

<script setup lang="ts">
import {computed, Ref, ref, ShallowRef, shallowRef} from 'vue'
import Book from "@/model/book/Book";
import BookStock from "@/model/book/BookStock";
import BookStockDialog from "@/views/book/compoents/BookStockDialog.vue";
import CardComponent from "@/components/card/CardComponent.vue";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";

interface Props {
	book: Book
}

const props = defineProps<Props>()

const headers = [
	{
		title: 'Code',
		align: 'start',
		sortable: false,
		value: 'code',
	},
	{title: 'Location', value: 'location_name'},
	{title: 'Status', value: 'status'},
	{title: 'Booked by', value: 'booked_user'},
	{title: 'Actions', value: 'actions', align: 'end',}
];

const stockDialog: Ref<boolean> = ref(false);
const selectedStock: ShallowRef<BookStock | null> = shallowRef(null);

function showEditStockDialog(stockId: number) {
	const stock = props.book.getStocks().find((stock) => stock.getId() === stockId);

	if (stock) {
		selectedStock.value = stock;
		stockDialog.value = true;
	}
}

function showAddStockDialog() {
	selectedStock.value = null;
	stockDialog.value = true;
}

const deleteLoading: Ref<number[]> = ref([]);

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
			status_text: status!.text,
			booked_user: stock.getCustomerName()
		}
	})
})

function printBarcode(id: number) {
	const stock = props.book.getStocks().find((stock) => stock.getId() === id);
	if (stock) {
		stock.printBarcode()
	}
}

/**
 *
 * @param stockId
 */
async function removeBookStock(stock: Record<string, any>) {
	confirmationDialogController.showDialog(`Delete stock ${stock.code}`, "Are you sure that you want to remove this book stock?", "Delete").then(async () => {
		try {
			deleteLoading.value.push(stock.id);
			await props.book.removeBookStock(stock.id);
		} finally {
			deleteLoading.value.splice(deleteLoading.value.indexOf(stock.id), 1);
		}
	})
}
</script>
