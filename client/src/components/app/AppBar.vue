<template>
	<!-- Page name -->
	<h4 style="font-size: 16px">{{ pageName }}</h4>

	<v-spacer></v-spacer>

	<v-autocomplete
		hide-details
		prepend-inner-icon="mdi-magnify"
		density="compact"
		style="max-width: 30%"
		placeholder="Search book..."
		class="mx-4"
	></v-autocomplete>


	<div class="d-flex align-center" style="font-weight: 400">
		<v-avatar
			class="mr-2"
			size="30"
			color="primary"
		>
			<v-icon dark>mdi-account</v-icon>
		</v-avatar>

		James sparrow
	</div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {applicationService} from "@/service/ApplicationService";
import {useRoute} from "vue-router";

const route = useRoute()

const pageName = computed(() => {
	return route.name || "";
})


</script>

<style scoped lang="scss">
.app-bar {
	display: flex;
	align-items: center;
	z-index: 2;
	position: sticky;
	left: 0;
	top: 0;
}
</style>