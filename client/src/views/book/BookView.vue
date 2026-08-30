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

			<template v-if="editing">
				<v-btn
					class="text-none mr-2"
					variant="text"
					@click="cancelEditing()"
					:disabled="loadingUpdate"
					small
				>
					{{t(AppLabels.CANCEL)}}
				</v-btn>
				<v-btn
					class="text-none"
					color="primary"
					:disabled="!hasChanges"
					@click="updateBook()"
					:loading="loadingUpdate"
					small
					variant="elevated"
				>
					{{t(AppLabels.SAVE)}}
				</v-btn>
			</template>

			<v-btn
				v-else
				class="text-none"
				color="primary"
				variant="elevated"
				small
				prepend-icon="mdi-pencil-outline"
				@click="startEditing()"
			>
				{{t(AppLabels.EDIT)}}
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
								<!-- ============================================== -->
								<!-- VIEW MODE									-->
								<!-- ============================================== -->
								<div v-if="!editing" class="pb-book-view pt-2">
									<h2 class="pb-display pb-book-view-title">{{ name || t(AppLabels.NAME) }}</h2>
									<div v-if="isbn" class="pb-mono pb-book-view-isbn">ISBN {{ isbn }}</div>

									<div class="pb-book-view-grid">
										<div class="pb-book-view-field">
											<div class="pb-eyebrow">{{t(AppLabels.CATEGORY)}}</div>
											<div class="pb-book-view-value">{{ categoryName || emptyValue }}</div>
										</div>
										<div class="pb-book-view-field">
											<div class="pb-eyebrow">{{t(AppLabels.LANGUAGE)}}</div>
											<div class="pb-book-view-value">{{ languageName || emptyValue }}</div>
										</div>
										<div class="pb-book-view-field">
											<div class="pb-eyebrow">{{t(AppLabels.FORMAT)}}</div>
											<div class="pb-book-view-value">{{ formatName || emptyValue }}</div>
										</div>
										<div class="pb-book-view-field">
											<div class="pb-eyebrow">{{t(AppLabels.PAGES)}}</div>
											<div class="pb-book-view-value">{{ pages || emptyValue }}</div>
										</div>
										<div class="pb-book-view-field">
											<div class="pb-eyebrow">{{t(AppLabels.PUBLISHER)}}</div>
											<div class="pb-book-view-value">{{ publisher || emptyValue }}</div>
										</div>
										<div class="pb-book-view-field">
											<div class="pb-eyebrow">{{t(AppLabels.PUBLISHED_DATE)}}</div>
											<div class="pb-book-view-value">{{ publishedDateDisplay || emptyValue }}</div>
										</div>
									</div>

									<div class="pb-book-view-field mt-3">
										<div class="pb-eyebrow">{{t(AppLabels.AUTHORS)}}</div>
										<div v-if="authors.length" class="d-flex flex-wrap ga-1 mt-1">
											<v-chip v-for="author in authors" :key="author.value" density="comfortable" variant="outlined">
												{{ author.text }}
											</v-chip>
										</div>
										<div v-else class="pb-book-view-value">{{ emptyValue }}</div>
									</div>

									<div v-if="description" class="pb-book-view-field mt-3">
										<div class="pb-eyebrow">{{t(AppLabels.DESCRIPTION)}}</div>
										<p class="pb-book-view-description">{{ description }}</p>
									</div>
								</div>

								<!-- ============================================== -->
								<!-- EDIT MODE									-->
								<!-- ============================================== -->
								<div v-else class="pt-2">
									<div class="d-flex">
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
								</div>
							</template>
						</card-component>
					</v-col>

					<v-col cols="12" md="3" lg="3" class="px-1">
						<book-image :book="model.getBook()"/>
						<div v-if="model.getBook().isElectronic()" class="mt-4">
							<book-file :book="model.getBook()"/>
						</div>
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
/**
 * Book detail view (`/app/book/:book_id`): a read-only view of the book's
 * metadata by default (`editing === false`), switching to the editable form
 * (each field a two-way computed bound directly to the `Book` model,
 * setting `hasChanges` so "Save" only enables once something's actually
 * changed) when "Edit" is pressed. "Cancel" restores a snapshot taken when
 * editing started. Also shows the cover image (`BookImage`), the ebook
 * file upload/preview (`BookFile`, only for `Electronic`-format books), and
 * the stock table (`BookStocks`).
 */
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
import BookFile from "@/views/book/compoents/BookFile.vue";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import {useI18n} from "vue-i18n";

const model = new BookController();

const {t} = useI18n();

/** Placeholder shown for an unset view-mode field. */
const emptyValue = "—";

/**
 *
 */
const hasChanges: Ref<boolean> = ref(false);

/** Whether the metadata card is showing the editable form (true) or the read-only view (false). */
const editing: Ref<boolean> = ref(false);

/** Snapshot of every editable field, taken when editing starts, restored on cancel. */
interface BookSnapshot {
	name: string;
	isbn: string | null;
	categoryId: number | null;
	languageCode: string | null;
	formatId: number | null;
	pages: number;
	authors: BookAuthor[];
	publisher: string | null;
	publishedDate: Date | null;
	description: string;
}

let snapshot: BookSnapshot | null = null;

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

const formatName = computed(() => model.getBook().getFormat()?.getFormatName() ?? null);

const language = computed({
	get() {
		return model.getBook().getLanguageCode();
	},
	set(val: string | null) {
		model.getBook().setLanguageCode(val);
		hasChanges.value = true;
	}
})

const languageName = computed(() => applicationService.getLanguage(model.getBook().getLanguageCode())?.getLanguageName() ?? null);

const category = computed({
	get() {
		return model.getBook().getCategoryId();
	},
	set(val: number | null) {
		model.getBook().setCategoryId(val);
		hasChanges.value = true;
	}
})

const categoryName = computed(() => applicationService.getCategory(model.getBook().getCategoryId())?.getCategoryName() ?? null);

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

const publishedDateDisplay = computed(() => {
	const date = model.getBook().getPublishDate();
	return date ? date.toLocaleDateString() : null;
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

/** Snapshot the current field values and switch the metadata card to the editable form. */
function startEditing() {
	const book = model.getBook();
	snapshot = {
		name: book.getName(),
		isbn: book.getIsbn(),
		categoryId: book.getCategoryId(),
		languageCode: book.getLanguageCode(),
		formatId: book.getFormat()?.getFormatId() ?? null,
		pages: book.getNumberOfPages(),
		authors: book.getAuthors(),
		publisher: book.getPublisher(),
		publishedDate: book.getPublishDate(),
		description: book.getDescription(),
	};
	editing.value = true;
}

/** Restore the pre-edit snapshot and switch the metadata card back to the read-only view. */
function cancelEditing() {
	if (snapshot) {
		const book = model.getBook();
		book.setName(snapshot.name);
		book.setIsbn(snapshot.isbn);
		book.setCategoryId(snapshot.categoryId);
		book.setLanguageCode(snapshot.languageCode);
		book.setFormat(snapshot.formatId != null ? applicationService.getFormat(snapshot.formatId) || null : null);
		book.setNumberOfPages(snapshot.pages);
		book.setAuthors(snapshot.authors);
		book.setPublisher(snapshot.publisher);
		book.setPublishDate(snapshot.publishedDate);
		book.setDescription(snapshot.description);
	}

	hasChanges.value = false;
	editing.value = false;
}

/**
 *
 */
async function updateBook() {
	if (hasChanges.value) {
		try {
			loadingUpdate.value = true;
			await model.getBook().updateBook();
			hasChanges.value = false;
			editing.value = false;
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

<style scoped lang="scss">
.pb-book-view-title {
	font-size: 26px;
	font-weight: 600;
	color: var(--pb-text);
	line-height: 1.2;
}

.pb-book-view-isbn {
	margin-top: 4px;
	font-size: 13px;
	color: var(--pb-text-muted);
}

.pb-book-view-grid {
	margin-top: 20px;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
	gap: 16px 24px;
}

.pb-book-view-value {
	margin-top: 2px;
	font-size: 15px;
	color: var(--pb-text);
}

.pb-book-view-description {
	margin: 4px 0 0;
	font-size: 14px;
	line-height: 1.6;
	color: var(--pb-text);
	white-space: pre-wrap;
}
</style>
