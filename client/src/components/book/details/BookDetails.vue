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
								label="Name"
								dense
								outlined
								class="mr-1"
							></v-text-field>

							<v-text-field
								v-model="isbn"
								label="ISBN"
								dense
								outlined
								class="ml-1"
							></v-text-field>
						</div>

						<div class="d-flex">
							<v-select
								v-model="category"
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
							chips
							outlined
							label="Authors"
							color="primary"
							placeholder="Add authors.."
							dense
							return-object
							multiple></v-autocomplete>

						<div class="d-flex">
							<v-text-field
								v-model="publisher"
								label="Publisher"
								dense
								outlined
								class="mr-1"
								style="width: 50%"
							></v-text-field>

							<v-text-field
								v-model="publishedDate"
								label="Published date"
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
import {computed, defineComponent, ref, Ref} from 'vue'
import Book from "@/model/book/Book";
//@ts-ignore
import notFound from "@/assets/images/notFound.jpg";
import {applicationService} from "@/service/ApplicationService";
import router from "@/router/Router";
import BookLocations from "@/components/book/details/BookLocations.vue";
import BookAuthor from "@/model/book/BookAuthor";

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
				return props.book.getPublishDate();
			},
			set(val: Date | null) {
				props.book.setPublishDate(val);
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
				return props.book.getAuthors();
			},
			set(val: BookAuthor[]) {
				props.book.setAuthors(val);
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
			authors
		}
	}
})
</script>

<style scoped lang="scss">

</style>