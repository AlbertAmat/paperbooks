<template>
	<div>
		<div class="d-flex mb-2">
			<v-btn
				class="text-none px-1"
				small
				text
				@click="goBack()"
			>
				<v-icon small>mdi-arrow-left</v-icon>
				Back
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn
				class="text-none mr-2"
				color="error"
				small
				outlined
			>
				Delete
			</v-btn>
			<v-btn
				class="text-none"
				color="primary"
				:disabled="!hasChanges"
				@click="updateBook()"
				:loading="loadingUpdate"
				small
			>
				Save
			</v-btn>
		</div>
		<v-row no-gutters>
			<v-col class="px-1">
				<!-- ================================================================== -->
				<!-- 																  	-->
				<!-- BOOK														-->
				<!-- 																  	-->
				<!-- ================================================================== -->
				<v-card class="mb-3">
					<v-card-title>
						<v-icon class="mr-2">mdi-book</v-icon>
						Book
					</v-card-title>
					<v-card-text>
						<div class="d-flex">
							<v-text-field
								v-model="name"
								:disabled="disableFields"
								label="Name"
								dense
								outlined
								class="mr-1"
							></v-text-field>

							<v-text-field
								v-model="isbn"
								:disabled="disableFields"
								label="ISBN"
								dense
								outlined
								class="ml-1"
							></v-text-field>
						</div>

						<div class="d-flex">
							<v-select
								v-model="category"
								:disabled="disableFields"
								:items="categoriesJson()"
								label="Category"
								outlined
								dense
								clearable
								class="mr-1"
								style="width: 50%"
							></v-select>

							<v-select
								v-model="language"
								:disabled="disableFields"
								:items="languagesJson()"
								label="Language"
								outlined
								dense
								clearable
								class="ml-1"
								style="width: 50%"
							></v-select>
						</div>

						<div class="d-flex">
							<v-select
								v-model="format"
								:disabled="disableFields"
								:items="formatsJson()"
								label="Format"
								outlined
								dense
								clearable
								class="mr-1"
								style="width: 50%"
							></v-select>

							<v-text-field
								v-model="pages"
								:disabled="disableFields"
								label="Pages"
								type="number"
								dense
								outlined
								class="ml-1"
								style="width: 50%"
							></v-text-field>
						</div>

						<v-autocomplete
							v-model="authors"
							:items="loadedAuthorsJSON"
							:loading="loadingAuthors"
							:search-input.sync="searchAuthors"
							:disabled="disableFields"
							item-text="text"
							item-value="value"
							chips
							outlined
							label="Authors"
							color="primary"
							placeholder="Add authors.."
							dense
							multiple
						></v-autocomplete>

						<div class="d-flex">
							<v-text-field
								v-model="publisher"
								label="Publisher"
								:disabled="disableFields"
								dense
								outlined
								class="mr-1"
								style="width: 50%"
							></v-text-field>

							<v-text-field
								v-model="publishedDate"
								label="Published date"
								:disabled="disableFields"
								type="date"
								dense
								outlined
								class="ml-1"
								style="width: 50%"
							></v-text-field>
						</div>
					</v-card-text>
				</v-card>

				<!-- ================================================================== -->
				<!-- 																  	-->
				<!-- DESCRIPTION														-->
				<!-- 																  	-->
				<!-- ================================================================== -->
				<v-card class="mb-3">
					<v-card-title>
						<v-icon class="mr-2">mdi-text-long</v-icon>
						Description
					</v-card-title>
					<v-card-text>
						<v-textarea
							v-model="description"
							:disabled="disableFields"
							dense
							outlined
							label="Description"
						></v-textarea>
					</v-card-text>
				</v-card>
			</v-col>

			<v-col cols="12" md="3" lg="3" class="px-1">
				<v-img
					:src="showFallbackImage ? notFound : book.getImageUrl()"
					@error="showFallbackImage = true"
					contain
					style="border-radius: 8px; object-fit: cover"
					max-height="360px"
				/>
			</v-col>
		</v-row>

		<!-- ================================================================== -->
		<!-- 																  	-->
		<!-- LOCATIONS															-->
		<!-- 																  	-->
		<!-- ================================================================== -->
		<book-locations :book="book"></book-locations>

		<!-- ================================================================== -->
		<!-- 																  	-->
		<!-- INFO																-->
		<!-- 																  	-->
		<!-- ================================================================== -->
		<v-card class="mx-1">
			<v-card-title>
				<v-icon class="mr-2">mdi-book-information-variant</v-icon>

				Info
			</v-card-title>
			<v-card-text>
				<div class="d-flex">
					<v-text-field
						:value="book.getId()"
						dense
						outlined
						hide-details
						disabled
						label="Identifier"
						class="mr-2"
					></v-text-field>

					<v-text-field
						:value="book.getFormatedDateUpdated()"
						dense
						outlined
						hide-details
						disabled
						label="Date updated"
						class="mr-2"
					></v-text-field>

					<v-text-field
						:value="book.getFormatedDateCreated()"
						dense
						outlined
						hide-details
						disabled
						label="Date created"
						class="mr-2"
					></v-text-field>
				</div>
			</v-card-text>
		</v-card>
	</div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, Ref, shallowRef, ShallowRef, watch} from 'vue'
import Book from "@/model/book/Book";
//@ts-ignore
import notFound from "@/assets/images/notFound.jpg";
import {applicationService} from "@/service/ApplicationService";
import router from "@/router/Router";
import BookLocations from "@/components/book/details/BookLocations.vue";
import BookAuthor from "@/model/book/BookAuthor";
import {authorService} from "@/service/author/AuthorService";

export default defineComponent({
	name: "BookDetails",
	components: {BookLocations},
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
		const loadingAuthors: Ref<boolean> = ref(false);

		/**
		 *
		 */
		const searchAuthors: Ref<string> = ref("");

		const loadedAuthors: ShallowRef<BookAuthor[]> = shallowRef(props.book.getAuthors())

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
				return props.book.getName();
			},
			set(val: string) {
				props.book.setName(val);
				hasChanges.value = true;
			}
		})

		const description = computed({
			get() {
				return props.book.getDescription();
			},
			set(val: string) {
				props.book.setDescription(val);
				hasChanges.value = true;
			}
		})

		const pages = computed({
			get() {
				return props.book.getNumberOfPages();
			},
			set(val: number) {
				props.book.setNumberOfPages(val);
				hasChanges.value = true;
			}
		})

		const format = computed({
			get() {
				const format = props.book.getFormat();
				return format ? format.getFormatId() : null;
			},
			set(val: number | null) {
				const format = val != null ? applicationService.getFormat(val) || null : null;
				props.book.setFormat(format);
				hasChanges.value = true;
			}
		})

		const language = computed({
			get() {
				return props.book.getLanguageCode();
			},
			set(val: string | null) {
				props.book.setLanguageCode(val);
				hasChanges.value = true;
			}
		})

		const category = computed({
			get() {
				return props.book.getCategoryId();
			},
			set(val: number | null) {
				props.book.setCategoryId(val);
				hasChanges.value = true;
			}
		})

		const publisher = computed({
			get() {
				return props.book.getPublisher();
			},
			set(val: string | null) {
				props.book.setPublisher(val);
				hasChanges.value = true;
			}
		})

		const publishedDate = computed({
			get() {
				const date = props.book.getPublishDate();
				if(date) {
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
				props.book.setPublishDate(val ? new Date(val) : null);
				hasChanges.value = true;
			}
		})

		const isbn = computed({
			get() {
				return props.book.getIsbn();
			},
			set(val: string | null) {
				props.book.setIsbn(val);
				hasChanges.value = true;
			}
		})

		const authors = computed({
			get() {
				return props.book.getAuthors().map((author) => author.getAuthorId());
			},
			set(val: number[]) {
				const items: BookAuthor[] = [];

				console.log("val",val)
				console.log("loadedAuthors",loadedAuthors.value)
				val.forEach((id) => {
					const item = loadedAuthors.value.find((a) => a.getAuthorId() === id);
					if(item) {
						items.push(item);
					}
				});

				props.book.setAuthors(items);
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

		function goBack() {
			router.back()
		}

		/**
		 *
		 */
		async function updateBook() {
			if(hasChanges.value) {
				try {
					loadingUpdate.value = true;
					await props.book.updateBook();
				} finally {
					loadingUpdate.value = false;
				}
			}
		}

		watch(() => searchAuthors.value, async (prompt: string | null) => {
			// prompt is empty
			if (prompt == null || prompt.trim().length === 0) return;

			// Items have already been requested
			if (loadingAuthors.value) return;

			try {
				loadingAuthors.value = true;
				const data = await authorService.searchAuthors(searchAuthors.value)
				if(data) {
					data.forEach((author) => {
						const index = loadedAuthors.value.findIndex((item) => item.getAuthorId() === author.id)
						if(index == -1) {
							loadedAuthors.value.push(new BookAuthor(author))
						}
					})

					loadedAuthors.value = [...loadedAuthors.value];
				}
			} finally {
				loadingAuthors.value = false;
			}
		})

		return {
			showFallbackImage,
			notFound,
			description,
			pages,
			name,
			isbn,
			hasChanges,
			format,
			formatsJson,
			applicationService,
			languagesJson,
			language,
			publisher,
			publishedDate,
			category,
			categoriesJson,
			goBack,
			authors,
			loadedAuthorsJSON,
			searchAuthors,
			loadingAuthors,
			loadingUpdate,
			updateBook,
			disableFields
		}
	}
})
</script>

<style scoped lang="scss">

</style>