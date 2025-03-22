<template>
	<v-dialog
		v-model="dialog"
		width="500"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				v-bind="attrs"
				v-on="on"
				small
				color="primary"
				class="text-none"
			>
				Add
			</v-btn>
		</template>

		<v-card>
			<v-card-title>
				Add book stock
			</v-card-title>

			<v-divider></v-divider>

			<v-card-text>
				<p class="mb-4 mt-1">
					Book stock represents individual copies of a book, allowing you to track quantity and status.
					Each book stock has a unique barcode for identification.
					Please ensure the stock barcode is added to the book.
				</p>

				<v-select
					v-model="selectedStatus"
					:items="status"
					label="Status"
				></v-select>
			</v-card-text>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					text
					small
					@click="closeDialog()"
					class="text-none"
				>
					Close
				</v-btn>
				<v-btn
					color="primary"
					outlined
					small
					:disabled="selectedStatus === null || loading"
					:loading="loading"
					@click="addStock()"
					class="text-none"
				>
					Add
				</v-btn>
				<v-btn
					color="primary"
					small
					:disabled="selectedStatus == null || loading"
					:loading="loading"
					@click="addStock(true)"
					class="text-none"
				>
					Add & print
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from 'vue'
import Book from "@/model/book/Book";
import {BookStockStatusEnum} from "@/types/book/IBookStock";
import BookStock from "@/model/book/BookStock";

export default defineComponent({
	name: "AddBookStock",
	props: {
		book: {
			type: Object as () => Book,
			required: true
		}
	},
	setup(props) {
		/**
		 *
		 */
		const dialog: Ref<boolean> = ref(false);

		/**
		 *
		 */
		const loading: Ref<boolean> = ref(false);

		/**
		 * The list of book status
		 */
		const status = BookStock.BookStockStatus;

		/**
		 *
		 */
		const selectedStatus: Ref<BookStockStatusEnum> = ref(BookStockStatusEnum.AVAILABLE);

		/**
		 *
		 * @param print
		 */
		function addStock(print: boolean = false) {
			try {
				loading.value = true;

				if(print) {

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
			selectedStatus.value = BookStockStatusEnum.AVAILABLE;
			dialog.value = false;
		}

		return {
			dialog,
			loading,
			status,
			selectedStatus,
			closeDialog,
			addStock
		}
	}
})
</script>

<style scoped lang="scss">

</style>