<template>
	<div
		class="app-bar"
	>
		<v-app-bar-nav-icon
			@click="toggleMenu()"
		/>

		<!-- Page name -->
		<h3>{{pageName}}</h3>

		<v-spacer></v-spacer>

		<v-autocomplete
			hide-details
			prepend-inner-icon="mdi-magnify"
			dense
			outlined
			style="max-width: 20%"
			placeholder="Search book..."
			class="mx-4"
		></v-autocomplete>

		<div class="d-flex align-center" style="font-weight: 450">
			<v-avatar
				class="elevation-1 mr-2"
				size="30"
				style="border-radius: 6px"
				color="primary"
			>
				<v-icon dark >mdi-account</v-icon>
			</v-avatar>

			James sparrow
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, computed} from "vue";
import {applicationService} from "@/service/ApplicationService";

export default defineComponent({
	name: "AppBar",
	setup() {

		const root = getCurrentInstance();

		const pageName = computed(() => {
			return root?.proxy.$route.name || "";
		})

		function toggleMenu() {
			applicationService.setMenu(!applicationService.getMenu())
		}

		return {
			pageName,
			toggleMenu
		}
	}
});
</script>

<style scoped lang="scss">
.app-bar {
	width: 100%;
	display: flex;
	align-items: center;
	position: sticky;
	top: 0px;
	bottom: 0;
	background-color: white;
	z-index: 2;
	height: 40px;
}
</style>