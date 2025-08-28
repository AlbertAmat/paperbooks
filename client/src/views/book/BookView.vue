<template>
	<page-component :model="model">
		<template v-slot:append>
			<v-btn
				variant="text"
				density="comfortable"
				icon
				class="text-none mr-2"
				color="error"
				@click="deleteBook()"
				:loading="loadingDelete"
				:disabled="loadingDelete"
				small
			>
				<v-icon>mdi-delete-outline</v-icon>
			</v-btn>
			<v-btn
				class="text-none gradient"
				color="primary"
				:disabled="!hasChanges"
				@click="updateBook()"
				:loading="loadingUpdate"
				small
			>
				Save
			</v-btn>
		</template>

		<template v-slot:default>
			<div style="height: 100%;">
				<v-row no-gutters>
					<v-col class="px-1">
						<!-- ================================================================== -->
						<!-- BOOK														-->
						<!-- ================================================================== -->
						<card-component
							title="Book"
							icon="mdi-book"
							dense
						>
							<template v-slot:default>
								<div class="d-flex pt-2">
									<!-- Name -->
									<v-text-field
										v-model="name"
										:disabled="disableFields"
										label="Name"
										density="compact"
										variant="outlined"
										class="mr-1"
									></v-text-field>

									<!-- ISBN code -->
									<v-text-field
										v-model="isbn"
										:disabled="disableFields"
										label="ISBN"
										density="compact"
										variant="outlined"
										class="ml-1"
									></v-text-field>
								</div>

								<div class="d-flex">
									<!-- Category -->
									<v-select
										v-model="category"
										:disabled="disableFields"
										:items="categoriesJson()"
										label="Category"
										density="compact"
										variant="outlined"
										item-value="value"
										item-title="text"
										clearable
										class="mr-1"
										style="width: 50%"
									></v-select>

									<!-- Language -->
									<v-select
										v-model="language"
										:disabled="disableFields"
										:items="languagesJson()"
										label="Language"
										density="compact"
										variant="outlined"
										item-value="value"
										item-title="text"
										clearable
										class="ml-1"
										style="width: 50%"
									></v-select>
								</div>

								<div class="d-flex">
									<!-- Format -->
									<v-select
										v-model="format"
										:disabled="disableFields"
										:items="formatsJson()"
										label="Format"
										density="compact"
										variant="outlined"
										item-value="value"
										item-title="text"
										clearable
										class="mr-1"
										style="width: 50%"
									></v-select>

									<!-- Pages -->
									<v-text-field
										v-model="pages"
										:disabled="disableFields"
										label="Pages"
										type="number"
										density="compact"
										variant="outlined"
										class="ml-1"
										style="width: 50%"
									></v-text-field>
								</div>

								<!-- Authors -->
								<v-autocomplete
									v-model="authors"
									:items="loadedAuthorsJSON"
									:loading="loadingAuthors"
									@update:search="searchAuthors"
									:disabled="disableFields"
									density="compact"
									variant="outlined"
									item-value="value"
									item-title="text"
									label="Authors"
									color="primary"
									placeholder="Add authors.."
									dense
									multiple
								></v-autocomplete>

								<div class="d-flex">
									<!-- Publisher -->
									<v-text-field
										v-model="publisher"
										label="Publisher"
										:disabled="disableFields"
										density="compact"
										variant="outlined"
										class="mr-1"
										style="width: 50%"
									></v-text-field>

									<!-- Published date -->
									<v-text-field
										v-model="publishedDate"
										label="Published date"
										:disabled="disableFields"
										type="date"
										density="compact"
										variant="outlined"
										class="ml-1"
										style="width: 50%"
									></v-text-field>
								</div>

								<!-- Description -->
								<v-textarea
									v-model="description"
									:disabled="disableFields"
									density="compact"
									variant="outlined"
									label="Description"
								></v-textarea>
							</template>
						</card-component>
					</v-col>

					<v-col cols="12" md="3" lg="3" class="px-1">
						<v-img
							:src="showFallbackImage ? notFound : model.getBook().getImageUrl()"
							@error="showFallbackImage = true"
							contain
							style="border-radius: 8px; object-fit: cover"
							max-height="360px"
						/>
					</v-col>
				</v-row>

				<!-- ================================================================== -->
				<!-- STOCKS																-->
				<!-- ================================================================== -->
				<book-stocks :book="model.getBook()"/>
			</div>
		</template>
	</page-component>
</template>

<script setup lang="ts">
import PageComponent from "@/views/PageComponent.vue";
import BookController from "@/controller/book/BookController";
import notFound from "@/assets/images/notFound.jpg";
import CardComponent from "@/components/card/CardComponent.vue";
import BookStocks from "@/views/book/compoents/BookStocks.vue";
import {computed, ref, Ref, shallowRef, ShallowRef} from "vue";
import BookAuthor from "@/model/author/BookAuthor";
import {applicationService} from "@/service/ApplicationService";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import {authorsService} from "@/service/author/AuthorsService";

const model = new BookController();

const showFallbackImage: Ref<boolean> = ref(false);

/**
 *
 */
const hasChanges: Ref<boolean> = ref(false);

/**
 *
 */
const loadingUpdate: Ref<boolean> = ref(false);

/**
 *
 */
const loadingDelete: Ref<boolean> = ref(false);

/**
 *
 */
const loadingAuthors: Ref<boolean> = ref(false);

const loadedAuthors: ShallowRef<BookAuthor[]> = shallowRef(model.getBook().getAuthors());

/**
 *
 */
const disableFields = computed(() => {
	return loadingUpdate.value
})

const loadedAuthorsJSON = computed(() => {
	return loadedAuthors.value.map((author) => {
		return {
			value: author.getAuthorId(),
			text: author.getAuthorName()
		}
	})
})

const name = computed({
	get() {
		return model.getBook().getName();
	},
	set(val: string) {
		model.getBook().setName(val);
		hasChanges.value = true;
	}
})

const description = computed({
	get() {
		return model.getBook().getDescription();
	},
	set(val: string) {
		model.getBook().setDescription(val);
		hasChanges.value = true;
	}
})

const pages = computed({
	get() {
		return model.getBook().getNumberOfPages();
	},
	set(val: number) {
		model.getBook().setNumberOfPages(val);
		hasChanges.value = true;
	}
})

const format = computed({
	get() {
		const format = model.getBook().getFormat();
		return format ? format.getFormatId() : null;
	},
	set(val: number | null) {
		const format = val != null ? applicationService.getFormat(val) || null : null;
		model.getBook().setFormat(format);
		hasChanges.value = true;
	}
})

const language = computed({
	get() {
		return model.getBook().getLanguageCode();
	},
	set(val: string | null) {
		model.getBook().setLanguageCode(val);
		hasChanges.value = true;
	}
})

const category = computed({
	get() {
		return model.getBook().getCategoryId();
	},
	set(val: number | null) {
		model.getBook().setCategoryId(val);
		hasChanges.value = true;
	}
})

const publisher = computed({
	get() {
		return model.getBook().getPublisher();
	},
	set(val: string | null) {
		model.getBook().setPublisher(val);
		hasChanges.value = true;
	}
})

const publishedDate = computed({
	get() {
		const date = model.getBook().getPublishDate();
		if (date) {
			const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
			const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
			const year = date.getFullYear(); // Get the full year

			return `${year}-${month}-${day}`;
		} else {
			return null;
		}
	},
	set(val: string | null) {
		console.log(val)
		model.getBook().setPublishDate(val ? new Date(val) : null);
		hasChanges.value = true;
	}
})

const isbn = computed({
	get() {
		return model.getBook().getIsbn();
	},
	set(val: string | null) {
		model.getBook().setIsbn(val);
		hasChanges.value = true;
	}
})

const authors = computed({
	get() {
		return model.getBook().getAuthors().map((author) => {
			return {
				value: author.getAuthorId(),
				text: author.getAuthorName()
			}
		});
	},
	set(val: number[]) {
		const items: BookAuthor[] = [];
		val.forEach((id) => {
			const item = loadedAuthors.value.find((a) => a.getAuthorId() === id);
			if (item) {
				items.push(item);
			}
		});

		model.getBook().setAuthors(items);
		hasChanges.value = true;
	}
})

function formatsJson() {
	return applicationService.getFormats().map((format) => {
		return {
			value: format.getFormatId(),
			text: format.getFormatName()
		}
	})
}

function languagesJson() {
	return applicationService.getLanguages().map((lang) => {
		return {
			value: lang.getLanguageCode(),
			text: lang.getLanguageName()
		}
	})
}

function categoriesJson() {
	return applicationService.getCategories().map((category) => {
		return {
			value: category.getCategoryId(),
			text: category.getCategoryName()
		}
	})
}

function deleteBook() {
	confirmationDialogController.showDialog(`Delete book '${model.getBook().getName()}'`, "Are you sure that you want to delete this book?", "Delete").then(async () => {
		try {
			loadingDelete.value = true;
			await model.getBook().deleteBook();
		} finally {
			loadingDelete.value = false;
		}
	})
}

/**
 *
 */
async function updateBook() {
	if (hasChanges.value) {
		try {
			loadingUpdate.value = true;
			await model.getBook().updateBook();
		} finally {
			loadingUpdate.value = false;
		}
	}
}

async function searchAuthors(prompt: string) {
	// prompt is empty
	if (prompt == null || prompt.trim().length === 0) return;

	// Items have already been requested
	if (loadingAuthors.value) return;

	try {
		loadingAuthors.value = true;
		const data = await authorsService.searchAuthors(prompt)
		if (data) {
			data.forEach((author) => {
				const index = loadedAuthors.value.findIndex((item) => item.getAuthorId() === author.id)
				if (index == -1) {
					loadedAuthors.value.push(new BookAuthor(author))
				}
			})

			loadedAuthors.value = [...loadedAuthors.value];
		}
	} finally {
		loadingAuthors.value = false;
	}
}
</script>