<template>
	<v-dialog
		v-model="dialog"
		width="700"
		scrollable
	>
		<template v-slot:activator="{ props: activatorProps }">
			<v-btn
				v-bind="activatorProps"
				color="primary"
				class="text-none gradient"
				small
			>
				Add book
			</v-btn>
		</template>

		<v-card>
			<v-card-title class="d-flex">
				Add book (ISBN)

				<v-spacer></v-spacer>

				<v-btn
					@click="dialog = false"
					icon
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-divider></v-divider>

			<v-card-text>
				<v-alert
					v-if="!multiple && errorIsbnCode.length > 0"
					type="warning"
					dense
					class="mt-1 mb-0"
				>
					Unable to automatically add book. Please, create book manually.
				</v-alert>

				<v-card-subtitle class="px-0">
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

					<v-checkbox
						v-model="multiple"
						:disabled="loadingIsbnCode.length != 0"
						hide-details
						density="compact"
						label="Multiple upload"
						class="ml-0"
					></v-checkbox>
				</div>

				<v-list
					v-if="multiple"
					dense
					style="max-height: 400px; overflow-y: auto; overflow-x: hidden "
				>
					<v-list-item
						v-for="(item, index) in isbnCodeList"
						:key="index"
						dense
						class="px-0"
					>
						<v-icon class="mr-2">mdi-book</v-icon>
						<v-list-item-title style="font-size: 14px">{{ item }}</v-list-item-title>
						<v-list-item-action>
							<v-progress-circular
								v-if="loadingIsbnCode.includes(item)"
								indeterminate
								size="20"
								color="primary"
							></v-progress-circular>

							<v-icon
								v-if="errorIsbnCode.includes(item)"
								color="error"
							>mdi-alert-circle
							</v-icon>
						</v-list-item-action>
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
					text
					class="text-none"
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

/**
 *
 */
const dialog: Ref<boolean> = ref(false);

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
const multiple: Ref<boolean> = ref(false);

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
	return loadingIsbnCode.value.length > 0
	|| multiple.value ? false : isbnCode.value.trim().length === 0
	|| multiple.value ? false : !isValidIsbn(isbnCode.value);
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

/**
 *
 */
async function createBook(code: string) {
	if (!disableButton.value) {
		try {
			if (!isbnCodeList.value.includes(code)) {
				isbnCodeList.value.push(code);
			}
			loadingIsbnCode.value.push(code);
			// TODO: CHECK IF BOOK EXIST
			const id = await bookService.createBookFromIsbn(code);
			if (id != null && !multiple.value) {
				router.push(bookRoute.getPath(id));
				dialog.value = false;
			}
		} catch (e) {
			const error = e as AxiosError;
			if (error.status === 404) {
				errorIsbnCode.value.push(code);
			}
		} finally {
			const index = loadingIsbnCode.value.indexOf(code);
			loadingIsbnCode.value.splice(index, 1);

			if (multiple.value && loadingIsbnCode.value.length == 0) {
				if (errorIsbnCode.value.length === 0) {
					isbnCodeList.value = isbnCodeList.value.filter((item) => !errorIsbnCode.value.includes(item))
				} else {
					dialog.value = false;
				}
			}
		}
	}
}

function handleEnter() {
	isbnCodeList.value.push(isbnCode.value);
	if (multiple.value) {
		isbnCode.value = "";
	} else {
		addBooks();
	}
}

function addBooks() {
	if (!isbnCodeList.value.includes(isbnCode.value)) {
		isbnCodeList.value.push(isbnCode.value);
	}

	isbnCodeList.value.forEach((code) => {
		createBook(code);
	})
}

watch(() => multiple.value, () => {
	if (!multiple.value) {
		isbnCodeList.value = [];
	}
})

watch(() => dialog.value, () => {
	if (!dialog.value) {
		isbnCode.value = "";
		isbnCodeList.value = [];
		errorIsbnCode.value = [];
		loadingIsbnCode.value = [];
		multiple.value = false;
	}
})
</script>