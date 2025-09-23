<template>
	<page-component :model="model">
		<template v-slot:prepend>
			<v-chip
				size="small"
				color="primary"
				class="ml-2"
				variant="flat"
			>
				{{ model.getTotalBooks() }}
			</v-chip>
		</template>

		<template v-slot:append>
			<v-btn
				density="compact"
				color="secondary"
				icon
				@click="gridLayout = !gridLayout"
				class="mr-3"
			>
				<v-icon size="18">{{ gridLayout ? 'mdi-view-grid-outline' : 'mdi-table' }}</v-icon>
			</v-btn>
			<v-menu>
				<template v-slot:activator="{ props }">
					<v-btn
						color="primary"
						class="text-none gradient pr-1"
						small
						@click.stop.prevent="createBookIsbnDialog = true"
					>
						{{t(AppLabels.ADD_BOOK)}}

						<v-divider vertical class="ml-2"/>

						<v-btn
							v-bind="props"
							variant="text"
							icon
							density="compact"
						>
							<v-icon>mdi-chevron-down</v-icon>
						</v-btn>
					</v-btn>
				</template>

				<v-list density="compact">
					<v-list-item @click="createBookManuallyDialog = true">
						<v-list-item-title>{{t(AppLabels.ADD_BOOK_MANUALLY)}}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>

			<create-book-isbn-dialog
				v-if="createBookIsbnDialog"
				v-model="createBookIsbnDialog"
			/>

			<create-book-manually-dialog
				v-if="createBookManuallyDialog"
				v-model="createBookManuallyDialog"
			/>

		</template>

		<template v-slot:default>
			<template v-if="gridLayout">
				<v-row no-gutters>
					<v-col
						v-for="book in model.getBooks()"
						:key="book.getId()"
						cols="12"
						sm="6"
						md="4"
						lg="3"
						class="pa-1"
					>
						<book-item :book="book"/>
					</v-col>

					<template v-if="loadingBooks">
						<v-col
							v-for="item in model.getLimit()"
							:key="item"
							cols="6"
							sm="4"
							md="3"
							class="pa-2"
						>
							<book-item-skeleton/>
						</v-col>
					</template>
				</v-row>

				<!-- Infinite scroll trigger -->
				<div ref="infiniteScrollTrigger" class="infinite-scroll-trigger"></div>
			</template>

			<v-data-table-server
				v-else
				fixed-header
				striped="even"
				:items-per-page="model.getLimit()"
				:items-per-page-options="[model.getLimit()]"
				:headers="headers"
				:items="itemsJson"
				:items-length="model.getTotalBooks()"
				:loading="loadingBooks"
				@update:page="loadMoreBooks"
				style="height: 100%"
			>
				<template v-slot:item.image="{ value }">
					<img
						:src="value"
						class="mr-2 my-0"
						style="border-radius: 6px; height: 45px; width: 35px; object-fit: cover"
					/>
				</template>
				<template v-slot:item.name="data">
					<a :href="data.item.url">{{ data.item.name }}</a>
				</template>
			</v-data-table-server>
		</template>
	</page-component>
</template>

<script setup lang="ts">
import {Ref, ref, onMounted, onUnmounted, computed, watch} from "vue";
import PageComponent from "@/views/PageComponent.vue";
import SearchController from "@/controller/search/SearchController";
import BookItem from "@/views/search/components/BookItem.vue";
import BookItemSkeleton from "@/views/search/components/BookItemSkeleton.vue";
import CreateBookIsbnDialog from "@/views/search/components/CreateBookIsbnDialog.vue";
import {applicationService} from "@/service/ApplicationService";
import router from "@/router/Router";
import CreateBookManuallyDialog from "@/views/search/components/CreateBookManuallyDialog.vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

const model = new SearchController();

const {t} = useI18n();

/**
 *
 */
const gridLayout: Ref<boolean> = ref(true);

const createBookIsbnDialog: Ref<boolean> = ref(false);
const createBookManuallyDialog: Ref<boolean> = ref(false);

/**
 *
 */
const loadingBooks: Ref<boolean> = ref(false);

/**
 *
 */
const infiniteScrollTrigger: Ref<HTMLElement | null> = ref(null);

const headers = [
	{title: t(AppLabels.IMAGE), 	key: 'image', 	sortable: false,},
	{title: t(AppLabels.NAME),	 	key: 'name', 	sortable: false,},
	{title: 'ISBN', 				key: 'isbn',	 sortable: false,},
	{title: t(AppLabels.CATEGORY),	key: 'category', sortable: false,},
	{title: t(AppLabels.LANGUAGE), 	key: 'language', sortable: false,},
]

const itemsJson = computed(() => {
	return model.getBooks().map((book) => {
		const category = applicationService.getCategory(book.getCategoryId());
		const language = applicationService.getLanguage(book.getLanguageCode());
		return {
			image: book.getImageUrl(),
			name: book.getName(),
			isbn: book.getIsbn(),
			category: category?.getCategoryName(),
			language: language?.getLanguageName(),
			url: window.location.origin + "/app" + book.getUrl()
		}
	})
})

/**
 *
 */
async function loadMoreBooks(page?: number) {
	if (model.hasNextPage() && !loadingBooks.value) {
		try {
			loadingBooks.value = true;
			if (page != undefined) {
				model.setPage(page - 1);
			} else {
				model.nextPage(); // Increment page
			}
			await model.fetchBooks();
		} finally {
			loadingBooks.value = false;
		}
	}
}

function handleScroll() {
	if (gridLayout.value) {
		const trigger = infiniteScrollTrigger.value;
		if (trigger) {
			const rect = trigger.getBoundingClientRect();
			if (rect.top < window.innerHeight) {
				loadMoreBooks();
			}
		}
	}
}

onMounted(async () => {
	// Attach scroll listener
	document.getElementById("scroller")!.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
	document.getElementById("scroller")!.removeEventListener("scroll", handleScroll);
});

watch(() => router.currentRoute.value.query, () => {
	model.fetchBooks(true);
}, {immediate: true})
</script>