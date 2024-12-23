<template>
	<v-app style="height: 100%">

		<v-overlay
			v-if="applicationService.isLoading()"
			:opacity="0"
			absolute
		>
			<v-progress-circular
				color="primary"
				indeterminate
			/>
		</v-overlay>

		<div
			v-else-if="applicationService.hasError()"
			class="error-container"
		>
			<p v-html="applicationService.getError().message"></p>
		</div>

		<template v-else>
			<!-- ================================================== -->
			<!-- APP MENU											-->
			<!-- ================================================== -->
			<app-menu></app-menu>

			<!-- ================================================== -->
			<!-- APP BAR											-->
			<!-- ================================================== -->
			<app-bar/>

			<v-main class="app-main">
				<v-container
					class="app-content pt-2"
					fluid
				>
					<router-view></router-view>
				</v-container>
			</v-main>
		</template>
	</v-app>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import AppBar from "@/components/AppBar.vue";
import AppMenu from "@/components/AppMenu.vue";
import {applicationService} from "@/service/ApplicationService";

export default defineComponent({
	name: 'App',
	components: {
		AppMenu,
		AppBar,
	},
	setup() {

		onMounted(() => {
			applicationService.fetchPolicy();
		})

		return {
			applicationService
		}
	}
});
</script>

<style scoped>
html, body {
	overflow-y: hidden;
	overflow-x: hidden;
	height: 100vh;
}

.app-main >>> .v-main__wrap {
	display: flex !important;
	flex-direction: column;
	flex: 1;
}

.app-main,
.app-content {
	background-color: #f6f6f6;
	overflow: hidden !important;
}

.app-content {
	width: 100%;
	flex: 1;
	padding: 20px;
}

.error-container {
	background-color: red;
	color: white;
	height: 100%;
}
</style>
