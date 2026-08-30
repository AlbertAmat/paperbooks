<template>
	<div class="book-item-skeleton">
		<v-skeleton-loader
			:elevation="0"
			type="image"
			class="book-item-skeleton-cover"
		/>
		<v-skeleton-loader
			:elevation="0"
			type="text"
			class="mt-2"
		/>
		<v-skeleton-loader
			:elevation="0"
			type="text"
			width="60%"
		/>
	</div>
</template>

<script setup lang="ts">
/** Loading placeholder shown in the search grid, shaped like `BookItem`, while the next page of results is loading. */
</script>

<style scoped>
.book-item-skeleton-cover {
	width: 100%;
	aspect-ratio: 2 / 3;
	border-radius: 4px;
	overflow: hidden;
}

.book-item-skeleton-cover :deep(.v-skeleton-loader__image) {
	height: 100%;
}
</style>
