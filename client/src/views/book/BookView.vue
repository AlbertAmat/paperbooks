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
				{{t(AppLabels.SAVE)}}
			</v-btn>
		</template>

		<template v-slot:default>
			<div style="height: 100%;">
				<v-row no-gutters class="mb-4">
					<v-col class="px-1">
						<!-- ================================================================== -->
						<!-- BOOK														-->
						<!-- ================================================================== -->
						<card-component
							:title="t(AppLabels.BOOK)"
							icon="mdi-book"
							dense
						>
							<template v-slot:default>
								<div class="d-flex pt-2">
									<!-- Name -->
									<v-text-field
										v-model="name"
										:disabled="disableFields"
										:label="t(AppLabels.NAME)"
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
										:label="t(AppLabels.CATEGORY)"
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
										:label="t(AppLabels.LANGUAGE)"
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
										:label="t(AppLabels.FORMAT)"
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
										:label="t(AppLabels.PAGES)"
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
									:label="t(AppLabels.AUTHORS)"
									color="primary"
									:placeholder="t(AppLabels.ADD_AUTHOR)"
									dense
									multiple
								></v-autocomplete>

								<div class="d-flex">
									<!-- Publisher -->
									<v-text-field
										v-model="publisher"
										:label="t(AppLabels.PUBLISHER)"
										:disabled="disableFields"
										density="compact"
										variant="outlined"
										class="mr-1"
										style="width: 50%"
									></v-text-field>

									<!-- Published date -->
									<v-text-field
										v-model="publishedDate"
										:label="t(AppLabels.PUBLISHED_DATE)"
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
									:label="t(AppLabels.DESCRIPTION)"
								></v-textarea>
							</template>
						</card-component>
					</v-col>

					<v-col cols="12" md="3" lg="3" class="px-1">
						<book-image :book="model.getBook()"/>
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
import CardComponent from "@/components/card/CardComponent.vue";
import BookStocks from "@/views/book/compoents/BookStocks.vue";
import {computed, ref, Ref, shallowRef, ShallowRef} from "vue";
import BookAuthor from "@/model/author/BookAuthor";
import {applicationService} from "@/service/ApplicationService";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import {authorsService} from "@/service/author/AuthorsService";
import BookImage from "@/views/book/compoents/BookImage.vue";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import {useI18n} from "vue-i18n";

const model = new BookController();

const {t} = useI18n();

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
	confirmationDialogController.showDialog(
		`${t(AppLabels.DELETE_BOOK)} '${model.getBook().getName()}'`,
		t(AppLabels.DELETE_BOOK_DESC),
		t(AppLabels.DELETE)
	).then(async () => {
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