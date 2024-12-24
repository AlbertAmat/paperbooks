<template>
	<page-component :model="model">
		<div class="d-flex mb-1">
			<div class="d-flex align-center">
				<span style="font-size: 13px">Total results:</span>
				<v-chip
					x-small
					class="ml-2"
				>
					{{ model.getTotalBooks() }}
				</v-chip>
			</div>
			<v-spacer></v-spacer>
			<create-book-isbn-dialog/>
		</div>

		<v-row no-gutters>
			<v-col
				v-for="book in model.getBooks()"
				:key="book.getId()"
				cols="12"
				sm="6"
				md="4"
				lg="3"
				class="pa-2"
			>
				<book-item :book="book"/>
			</v-col>

			<template v-if="loadingBooks">
				{{$vuetify.breakpoint}}
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
	</page-component>
</template>

<script lang="ts">
import {defineComponent, Ref, ref, onMounted, onUnmounted} from "vue";
import PageComponent from "@/views/PageComponent.vue";
import SearchController from "@/controller/search/SearchController";
import BookItem from "@/components/book/BookItem.vue";
import BookItemSkeleton from "@/components/book/BookItemSkeleton.vue";
import CreateBookIsbnDialog from "@/views/search/CreateBookIsbnDialog.vue";

export default defineComponent({
	name: "BooksSearchView",
	components: {CreateBookIsbnDialog, BookItemSkeleton, BookItem, PageComponent},
	setup() {

		const model = new SearchController();

		/**
		 *
		 */
		const loadingBooks: Ref<boolean> = ref(false);

		/**
		 *
		 */
		const infiniteScrollTrigger: Ref<HTMLElement | null> = ref(null);

		/**
		 *
		 */
		async function loadMoreBooks() {
			if (model.hasNextPage() && !loadingBooks.value) {
				try {
					loadingBooks.value = true;
					model.nextPage(); // Increment page
					await model.fetchBooks();
				} finally {
					loadingBooks.value = false;
				}
			}
		}

		function handleScroll() {
			const trigger = infiniteScrollTrigger.value;
			if (trigger) {
				const rect = trigger.getBoundingClientRect();
				if (rect.top < window.innerHeight) {
					loadMoreBooks();
				}
			}
		}

		onMounted(async () => {
			// Attach scroll listener
			window.addEventListener("scroll", handleScroll);
		});

		onUnmounted(() => {
			window.removeEventListener("scroll", handleScroll);
		});

		return {
			model,
			loadingBooks,
			infiniteScrollTrigger
		}
	}
});
</script>

<style scoped lang="scss">
</style>