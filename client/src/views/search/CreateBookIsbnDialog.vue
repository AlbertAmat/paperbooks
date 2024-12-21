<template>
	<v-dialog
		v-model="dialog"
		width="700"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				color="primary"
				class="text-none"
				small
				v-bind="attrs"
				v-on="on"
			>
				Add book (ISBN)
			</v-btn>
		</template>

		<v-card>
			<v-card-title class="text-h5 grey lighten-2">
				Add book (ISBN)
			</v-card-title>

			<v-card-text>
				<v-card-subtitle class="px-0">
					Easily add a book to your library by entering its ISBN code. The app will automatically fetch the book's details,
					including title, author, description, and more, and seamlessly add it to your collection.
				</v-card-subtitle>

				<v-text-field
					v-model="isbnCode"
					:disabled="loading"
					:rules="[isbnValidationRule]"
					label="ISBN code"
					autofocus
					style="width: 350px"
					@keydown.enter="addBook()"
				></v-text-field>
			</v-card-text>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="primary"
					:loading="loading"
					:disabled="disableButton"
					text
					class="text-none"
					@click="addBook()"
				>
					Add
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, ref, Ref} from "vue";
import {validateIsbn10, validateIsbn13} from "@/utils/IsbnVerification";
import {bookService} from "@/service/book/BookService";

export default defineComponent({
	name: "CreateBookIsbnDialog",
	setup() {
		/**
		 *
		 */
		const dialog: Ref<boolean> = ref(false);

		/**
		 *
		 */
		const loading: Ref<boolean> = ref(false);

		/**
		 *
		 */
		const isbnCode: Ref<string> = ref("");

		/**
		 *
		 */
		const disableButton = computed(() => {
			return loading.value || isbnCode.value.trim().length === 0 || !isValidIsbn(isbnCode.value);
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
		async function addBook() {
			if(!disableButton.value) {
				try {
					loading.value = true;
					// TODO: CHECK IF BOOK EXIST
					await bookService.createBookFromIsbn(isbnCode.value)
					dialog.value = false;
				} finally {
					loading.value = false;
				}
			}
		}

		return {
			addBook,
			dialog,
			loading,
			isbnCode,
			disableButton,
			isbnValidationRule
		}
	}
})
</script>

<style scoped lang="scss">

</style>