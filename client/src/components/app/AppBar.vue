<template>
	<v-app-bar
		class="app-bar pr-4"
		density="compact"
	>
		<v-app-bar-nav-icon
			@click="toggleMenu()"
		/>

		<!-- Page name -->
		<v-app-bar-title>{{ pageName }}</v-app-bar-title>


		<v-autocomplete
			hide-details
			prepend-inner-icon="mdi-magnify"
			density="compact"
			style="max-width: 40%"
			placeholder="Search book..."
			class="mx-4"
		></v-autocomplete>

		<v-spacer></v-spacer>


		<div class="d-flex align-center" style="font-weight: 450">
			<v-avatar
				class="elevation-1 mr-2"
				size="30"
				style="border-radius: 6px"
				color="primary"
			>
				<v-icon dark>mdi-account</v-icon>
			</v-avatar>

			James sparrow
		</div>
	</v-app-bar>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {applicationService} from "@/service/ApplicationService";
import {useRoute} from "vue-router";

const route = useRoute()

const pageName = computed(() => {
	return route.name || "";
})

function toggleMenu() {
	applicationService.setMenu(!applicationService.getMenu())
}

</script>

<style scoped lang="scss">
.app-bar {
	display: flex;
	align-items: center;
	z-index: 2;
}
</style>