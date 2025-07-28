<template>
	<v-dialog
		v-model="dialog"
		width="500"
	>
		<v-card>
			<v-card-title>
				{{ stock ? 'Edit book stock' : 'Add book stock' }}
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
					hide-details
				></v-select>

				<v-select
					v-model="selectedLocation"
					:items="locations"
					label="Locations"
					hide-details
					class="mt-3"
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
					:disabled="selectedStatus === null || selectedLocation == null || loading"
					:loading="loading"
					@click="addStock()"
					class="text-none"
				>
					{{ stock ? 'Update' : 'Add' }}
				</v-btn>
				<v-btn
					v-if="!stock"
					color="primary"
					small
					:disabled="selectedStatus === null || selectedLocation == null || loading"
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

<script setup lang="ts">
import {computed, defineComponent, Ref, ref} from 'vue'
import Book from "@/model/book/Book";
import {BookStockStatusEnum} from "@/types/book/IBookStock";
import BookStock from "@/model/book/BookStock";
import {applicationService} from "@/service/ApplicationService";

interface Props {
	book: Book,
	stock?: BookStock,
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
 * The list of book status
 * Removed booked status, since we are adding a book stock ord updating.
 * Booked status is added bya customer page
 */
const status = BookStock.BookStockStatus.filter((item) => item.value != BookStockStatusEnum.BOOKED);

const locations = computed(() => {
	return applicationService.getLocations().map((location) => {
		return {
			value: location.getId(),
			text: location.getName()
		}
	})
})

/**
 *
 */
const selectedStatus: Ref<BookStockStatusEnum> = ref(props.stock ? props.stock.getStatus() : BookStockStatusEnum.AVAILABLE);

/**
 *
 */
const selectedLocation: Ref<number | null> = ref(props.stock ? props.stock.getLocationId() : null);

/**
 *
 * @param print
 */
async function addStock(print: boolean = false) {
	if (selectedLocation.value != null) {
		try {
			loading.value = true;
			if (props.stock) {
				await props.stock.update(selectedStatus.value, selectedLocation.value)
			} else {
				await props.book.addBookStock(selectedStatus.value, selectedLocation.value, print);
			}
			closeDialog();
		} finally {
			loading.value = false;
		}
	}
}

/**
 *
 */
function closeDialog() {
	selectedStatus.value = BookStockStatusEnum.AVAILABLE;
	selectedLocation.value = null;
	dialog.value = false;
}
</script>
