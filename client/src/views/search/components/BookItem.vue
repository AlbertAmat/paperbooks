<template>
	<v-hover v-slot="{ isHovering }">
		<router-link
			:to="book.getUrl()"
			class="book-item"
			:class="{'book-item--hover': isHovering}"
		>
			<img
				:src="showFallback ? notFound : book.getImageUrl()"
				@error="showFallback = true"
				class="book-item-cover"
			/>

			<div class="book-item-info">
				<!-- Book name -->
				<div :title="book.getName()" class="book-title pb-display ellipsis">
					{{ book.getName() }}
				</div>

				<!-- Book author-->
				<div
					v-if="book.hasAuthors()"
					:title="book.getAuthors()[0].getAuthorName()"
					class="book-subtitle ellipsis"
				>
					{{ book.getAuthors()[0].getAuthorName() }}
				</div>
			</div>
		</router-link>
	</v-hover>
</template>

<script setup lang="ts">
/** One book card in the search results grid: poster-style cover with name and first author below. */
import {ref, Ref} from "vue";
import BookItem from "@/model/book/BookItem";

//@ts-ignore
import notFound from "@/assets/images/notFound.jpg";

interface Props {
	book: BookItem
}

const props = defineProps<Props>()

/**
 *
 */
const showFallback: Ref<boolean> = ref(props.book.getImageUrl() === null);
</script>

<style scoped lang="scss">
.book-item {
	display: block;
	text-decoration: none;
	color: inherit;
	border-radius: var(--pb-radius-sm);
	transition: transform 0.15s ease;
}

.book-item--hover {
	transform: translateY(-3px);
}

.book-item-cover {
	width: 100%;
	aspect-ratio: 2 / 3;
	border-radius: 4px;
	object-fit: cover;
	background: var(--pb-surface-alt);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
	transition: box-shadow 0.15s ease;
}

.book-item--hover .book-item-cover {
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.book-item-info {
	margin-top: 6px;
}

.book-title {
	line-height: 1.25;
	font-weight: 600;
	font-size: 12px;
	color: var(--pb-text);
}

.book-subtitle {
	margin-top: 2px;
	font-size: 11px;
	color: var(--pb-text-muted);
}

.ellipsis {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	display: block;
}
</style>