<template>
	<v-card
		height="134px"
		flat
		style="border-radius: var(--pb-radius-sm); border: 1px solid var(--pb-border); background: var(--pb-surface)"
	>
		<v-skeleton-loader
			:elevation="0"
			type="list-item-avatar-three-line"
		></v-skeleton-loader>
	</v-card>
</template>

<script setup lang="ts">
/** Loading placeholder shown in the search grid, shaped like `BookItem`, while the next page of results is loading. */
</script>