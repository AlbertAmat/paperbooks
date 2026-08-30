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
				color="primary"
				icon
				@click="gridLayout = !gridLayout"
				class="mr-3"
			>
				<v-icon>{{ gridLayout ? 'mdi-view-grid-outline' : 'mdi-table' }}</v-icon>
			</v-btn>
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
				<template v-if="gridLayout">
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

				</template>

				<div v-else class="pb-card book-list">
					<router-link
						v-for="(book, index) in listBooks"
						:key="book.id"
						:to="book.url"
						class="book-list-row"
						:class="{'book-list-row--border': index !== listBooks.length - 1}"
					>
						<img
							v-if="book.image"
							:src="book.image"
							class="book-list-cover"
						/>
						<div v-else class="book-list-cover book-list-cover--placeholder">
							<v-icon size="18" color="var(--pb-text-muted)">mdi-image-outline</v-icon>
						</div>

						<div class="book-list-title-group">
							<span class="book-list-name">{{ book.name }}</span>
							<span v-if="book.author" class="book-list-author">{{ book.author }}</span>
						</div>

						<span v-if="book.isbn" class="book-list-isbn pb-mono">{{ book.isbn }}</span>

						<v-chip v-if="book.category" density="compact" variant="tonal" class="book-list-chip">
							{{ book.category }}
						</v-chip>

						<v-chip v-if="book.language" density="compact" variant="outlined" class="book-list-chip">
							{{ book.language }}
						</v-chip>
					</router-link>
				</div>

				<!-- Infinite scroll trigger -->
				<div ref="infiniteScrollTrigger" class="infinite-scroll-trigger"></div>

				<div v-if="loadingBooks && !gridLayout" class="book-list-loading">
					<v-progress-circular indeterminate size="20" width="2" color="primary"/>
				</div>
			</template>
		</template>
	</page-component>
</template>

<script setup lang="ts">
/**
 * Book search/library view: a grid or row-list layout of search results
 * (both infinite-scroll, via a scroll-position check against `#scroller`),
 * filters, and the two "add book" entry points (ISBN or manual). Re-runs
 * the search whenever the route's query string changes.
 */
import {Ref, ref, onMounted, onUnmounted, computed, watch, nextTick} from "vue";
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
import SearchFilters from "@/views/search/components/SearchFilters.vue";
import EmptyState from "@/components/emptyState/EmptyState.vue";

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

/**
 * Book rows for the list layout: cover, name/author, ISBN, category and
 * language, resolved from the app-wide category/language caches.
 */
const listBooks = computed(() => {
	return model.getBooks().map((book) => {
		const category = applicationService.getCategory(book.getCategoryId());
		const language = applicationService.getLanguage(book.getLanguageCode());
		return {
			id: book.getId(),
			image: book.getImageUrl(),
			name: book.getName(),
			author: book.hasAuthors() ? book.getAuthors()[0].getAuthorName() : null,
			isbn: book.getIsbn(),
			category: category?.getCategoryName(),
			language: language?.getLanguageName(),
			url: book.getUrl()
		}
	})
})

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
});

onUnmounted(() => {
	document.getElementById("scroller")!.removeEventListener("scroll", handleScroll);
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
.book-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
	gap: 16px 12px;
	padding: 4px;
}

.book-list {
	overflow: hidden;
}

.book-list-row {
	display: flex;
	align-items: center;
	gap: 14px;
	padding: 10px 18px;
	text-decoration: none;
	color: inherit;
	transition: background-color 0.15s ease;
}

.book-list-row:hover {
	background: var(--pb-surface-alt);
}

.book-list-row--border {
	border-bottom: 1px solid var(--pb-border);
}

.book-list-cover {
	flex-shrink: 0;
	height: 48px;
	width: 34px;
	border-radius: 4px;
	object-fit: cover;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.book-list-cover--placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--pb-surface-alt);
	box-shadow: none;
}

.book-list-title-group {
	flex: 1 1 220px;
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.book-list-name {
	font-size: 14px;
	font-weight: 600;
	color: var(--pb-text);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.book-list-author {
	font-size: 12px;
	color: var(--pb-text-muted);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.book-list-isbn {
	flex: 0 0 140px;
	font-size: 12px;
	color: var(--pb-text-muted);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.book-list-chip {
	flex-shrink: 0;
}

.book-list-loading {
	display: flex;
	justify-content: center;
	padding: 14px 0;
}

@media (max-width: 720px) {
	.book-list-isbn {
		display: none;
	}
}
</style>