<template>
	<v-dialog
		v-model="dialog"
		width="700"
		scrollable
	>
		<v-card>
			<v-card-title class="d-flex" style="align-items: center">
				Add book (ISBN)

				<v-spacer></v-spacer>

				<v-btn
					@click="dialog = false"
					variant="text"
					icon
					density="comfortable"
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-divider></v-divider>

			<v-card-text>
				<v-card-subtitle class="px-0" style="white-space: normal">
					Easily add a book to your library by entering its ISBN code. The app will automatically fetch the
					book's details,
					including title, author, description, and more, and seamlessly add it to your collection.
				</v-card-subtitle>

				<div style="display: flex; align-items: center">
					<v-text-field
						v-model="isbnCode"
						:disabled="loadingIsbnCode.length != 0"
						:rules="[isbnValidationRule]"
						label="ISBN code"
						variant="outlined"
						hide-details
						density="compact"
						autofocus
						style="width: 250px; flex: none"
						class="mt-3"
						@keydown.enter="handleEnter()"
					></v-text-field>
				</div>

				<v-list
					density="compact"
					style="max-height: 400px; overflow-y: auto; overflow-x: hidden "
					slim
				>
					<v-list-item
						v-for="(item, index) in isbnCodeList"
						:key="index"
						density="compact"
						class="px-0"
						prepend-icon="mdi-book"
						:title="item"
						slim
					>
						<template v-slot:append>
							<v-progress-circular
								v-if="loadingIsbnCode.includes(item)"
								indeterminate
								size="20"
								color="primary"
							></v-progress-circular>

							<v-icon
								v-if="errorIsbnCode.includes(item)"
								color="error"
							>
								mdi-alert-circle
							</v-icon>
						</template>
					</v-list-item>
				</v-list>
			</v-card-text>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					text
					class="text-none"
					@click="dialog = false"
				>
					Cancel
				</v-btn>
				<v-btn
					color="primary"
					:loading="loadingIsbnCode.length > 0"
					:disabled="disableButton"
					variant="elevated"
					class="text-none mr-4"
					@click="addBooks()"
				>
					Add
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import {computed, ref, Ref, watch} from "vue";
import {validateIsbn10, validateIsbn13} from "@/utils/IsbnVerification";
import {bookService} from "@/service/book/BookService";
import router from "@/router/Router";
import {AxiosError} from "axios";
import {bookRoute} from "@/router/routes/BookRoute";
import Book from "@/model/book/Book";
import BookStock from "@/model/book/BookStock";

interface Props {
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
	get() {
		return props.modelValue;
	},
	set(value: boolean) {
		emit("update:modelValue", value)
	}
});

/**
 *
 */
const loadingIsbnCode: Ref<string[]> = ref([]);

/**
 *
 */
const errorIsbnCode: Ref<string[]> = ref([]);

/**
 *
 */
const isbnCode: Ref<string> = ref("");

/**
 *
 */
const isbnCodeList: Ref<string[]> = ref([]);

/**
 *
 */
const disableButton = computed(() => {
	return loadingIsbnCode.value.length > 0 || isbnCodeList.value.length == 0
})

// ISBN validation function
function isValidIsbn(isbn: string): boolean {
	// Remove any non-digit characters (like spaces or dashes)
	isbn = isbn.replace(/[^0-9X]/gi, "");

	// Validate ISBN-13
	if (isbn.length === 13) {
		return validateIsbn13(isbn);
	}

	// Validate ISBN-10
	if (isbn.length === 10) {
		return validateIsbn10(isbn);
	}

	return false;
}

// Computed property for validation rule
const isbnValidationRule = computed(() => {
	return (value: string) => {
		if (isValidIsbn(value)) {
			return true;
		} else {
			return "Invalid ISBN format. Please enter a valid ISBN-10 or ISBN-13.";
		}
	};
});

function handleEnter() {
	isbnCodeList.value.push(isbnCode.value);
	isbnCode.value = "";
}

function addBooks() {
	isbnCodeList.value.forEach(async (code) => {
		try {
			loadingIsbnCode.value.push(code);
			// TODO: CHECK IF BOOK EXIST
			await bookService.createBookFromIsbn(code);
		} catch (e) {
			const error = e as AxiosError;
			if (error.status === 404 || error.status === 500) {
				errorIsbnCode.value.push(code);
			}
		} finally {
			const index = loadingIsbnCode.value.indexOf(code);
			loadingIsbnCode.value.splice(index, 1);

			if (loadingIsbnCode.value.length == 0) {
				if (errorIsbnCode.value.length === 0) {
					isbnCodeList.value = [...isbnCodeList.value.filter((item) => !errorIsbnCode.value.includes(item))]
				} else {
					dialog.value = false;
				}
			}
		}
	})
}

watch(() => dialog.value, () => {
	if (!dialog.value) {
		isbnCode.value = "";
		isbnCodeList.value = [];
		errorIsbnCode.value = [];
		loadingIsbnCode.value = [];
	}
})
</script>