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
			<v-select
				:model-value="model.getSort()"
				:items="sortOptions"
				item-title="title"
				item-value="value"
				:label="t(AppLabels.SORT_BY)"
				density="compact"
				variant="outlined"
				hide-details
				class="search-toolbar-sort mr-3"
				@update:model-value="model.setSort($event)"
			/>

			<v-menu>
				<template v-slot:activator="{ props }">
					<v-btn
						color="primary"
						variant="tonal"
						class="text-none pr-1"
						small
						@click.stop.prevent="createBookIsbnDialog = true"
					>
						{{t(AppLabels.ADD_BOOK)}}

						<v-divider vertical class="ml-2"/>

						<v-btn
							v-bind="props"
							icon
							variant="text"
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
			<search-filters :model="model"/>

			<empty-state
				v-if="model.getBooks().length === 0 && !loadingBooks"
				icon="mdi-book-plus-outline"
				:chip-icons="['mdi-book-outline', 'mdi-bookshelf', 'mdi-book-open-page-variant', 'mdi-book-multiple-outline', 'mdi-book-open-variant', 'mdi-barcode-scan', 'mdi-book-account-outline', 'mdi-notebook-outline']"
				:title="t(AppLabels.EMPTY_LIBRARY_TITLE)"
				:description="t(AppLabels.EMPTY_LIBRARY_DESC)"
			>
				<v-btn
					@click="createBookIsbnDialog = true"
					class="text-none"
					color="primary"
					variant="elevated"
					small
				>
					{{t(AppLabels.ADD_BOOK)}}
				</v-btn>
			</empty-state>

			<template v-else>
				<div class="book-grid">
					<book-item
						v-for="book in model.getBooks()"
						:key="book.getId()"
						:book="book"
					/>

					<template v-if="loadingBooks">
						<book-item-skeleton
							v-for="item in model.getLimit()"
							:key="item"
						/>
					</template>
				</div>

				<!-- Infinite scroll trigger -->
				<div ref="infiniteScrollTrigger" class="infinite-scroll-trigger"></div>
			</template>
		</template>
	</page-component>
</template>

<script setup lang="ts">
/**
 * Book search/library view: a card-grid of search results (infinite-scroll,
 * via a scroll-position check against `#scroller`), filters, and the two
 * "add book" entry points (ISBN or manual). Re-runs the search whenever the
 * route's query string changes.
 */
import {Ref, ref, onMounted, onUnmounted, watch, nextTick} from "vue";
import PageComponent from "@/views/PageComponent.vue";
import SearchController, {activeSearchController} from "@/controller/search/SearchController";
import {SortType} from "@/types/search/SortType";
import BookItem from "@/views/search/components/BookItem.vue";
import BookItemSkeleton from "@/views/search/components/BookItemSkeleton.vue";
import CreateBookIsbnDialog from "@/views/search/components/CreateBookIsbnDialog.vue";
import router from "@/router/Router";
import CreateBookManuallyDialog from "@/views/search/components/CreateBookManuallyDialog.vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import SearchFilters from "@/views/search/components/SearchFilters.vue";
import EmptyState from "@/components/emptyState/EmptyState.vue";

const model = new SearchController();

const {t} = useI18n();

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

const sortOptions = [
	{title: t(AppLabels.SORT_NAME_ASC), value: SortType.NAME_ASC},
	{title: t(AppLabels.SORT_NAME_DESC), value: SortType.NAME_DESC},
	{title: t(AppLabels.SORT_DATE_NEWEST), value: SortType.DATE_NEWEST},
	{title: t(AppLabels.SORT_DATE_OLDEST), value: SortType.DATE_OLDEST}
]

/**
 *
 */
async function loadMoreBooks() {
	if (model.hasNextPage() && !loadingBooks.value) {
		try {
			loadingBooks.value = true;
			model.nextPage();
			await model.fetchBooks();
		} finally {
			loadingBooks.value = false;
		}
	}
}

/**
 * Distance (px) below the viewport at which the trigger still counts as
 * "reached". Without this buffer, the trigger (zero-height, the very last
 * element) sits exactly flush with the viewport bottom at max scroll, so
 * `rect.top < window.innerHeight` is never true there - the last page is
 * unreachable by scrolling.
 */
const SCROLL_TRIGGER_MARGIN = 300;

function handleScroll() {
	const trigger = infiniteScrollTrigger.value;
	if (trigger) {
		const rect = trigger.getBoundingClientRect();
		if (rect.top < window.innerHeight + SCROLL_TRIGGER_MARGIN) {
			loadMoreBooks();
		}
	}
}

onMounted(async () => {
	// Attach scroll listener
	document.getElementById("scroller")!.addEventListener("scroll", handleScroll);

	// Let the global app bar's filter icon (see AppBar.vue) find and drive
	// this view's controller while it's on screen.
	activeSearchController.value = model;
});

onUnmounted(() => {
	document.getElementById("scroller")!.removeEventListener("scroll", handleScroll);

	if (activeSearchController.value === model) {
		activeSearchController.value = null;
	}
});

watch(() => router.currentRoute.value.query, () => {
	model.fetchBooks(true);
}, {immediate: true})

// If a loaded page doesn't fill/overflow the scroller, no 'scroll' event
// will ever fire to pull in the next page - check after every load instead.
watch(() => model.getBooks(), () => {
	nextTick(handleScroll);
})
</script>

<style scoped>
.search-toolbar-sort {
	max-width: 150px;
	flex: 0 0 auto;
}

.search-toolbar-sort :deep(.v-field) {
	height: 32px;
	min-height: 32px;
	font-size: 13px;
	border-radius: 8px;
}

.search-toolbar-sort :deep(.v-field__input) {
	min-height: 32px;
	padding-top: 0;
	padding-bottom: 0;
}

.search-toolbar-sort :deep(.v-field__append-inner) {
	padding-top: 0;
	align-items: center;
}

.search-toolbar-sort :deep(.v-label) {
	font-size: 12px;
	top: 8px;
}

.book-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
	gap: 16px 12px;
	padding: 4px;
}
</style>