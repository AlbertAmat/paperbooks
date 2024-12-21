<template>
	<v-card height="134px" flat style="border-radius: 8px;">
		<v-skeleton-loader
			:elevation="0"
			type="list-item-avatar-three-line"
		></v-skeleton-loader>
	</v-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: "BookItemSkeleton",
	setup() {
		return {}
	}
})
</script>