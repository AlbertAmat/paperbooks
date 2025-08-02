<template>
	<v-app>

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

			<v-main class="app-main">
				<v-card class="app-content my-2 mr-2">
					<!-- ================================================== -->
					<!-- APP BAR											-->
					<!-- ================================================== -->
					<v-card-title style="display: flex; align-items: center; font-size: 14px">
						<app-bar/>
					</v-card-title>

					<v-card-text style="overflow: auto; display: flex; flex-direction: column; flex: 1">

						<div id="scroller" style="flex: 1; overflow-y: auto; padding-top: 10px; margin-top: 4px">
							<router-view></router-view>

							<confirmation-dialog/>
						</div>
					</v-card-text>
				</v-card>
			</v-main>
		</template>
	</v-app>
</template>

<script setup lang="ts">
import {defineComponent, onMounted} from 'vue';
import AppBar from "@/components/app/AppBar.vue";
import AppMenu from "@/components/app/AppMenu.vue";
import {applicationService} from "@/service/ApplicationService";
import ConfirmationDialog from "@/components/confirmationDialog/ConfirmationDialog.vue";

onMounted(() => {
	applicationService.fetchPolicy();
})
</script>

<style>
html, body {
	height: 100vh;
	overflow: hidden;
}

#app {
	height: 100%;
}

.app-main {
	overflow: auto;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.app-main .v-main__wrap {
	display: flex !important;
	flex-direction: column;
	flex: 1;
}

.app-content {
	position: relative;
	display: flex !important;
	flex-direction: column !important;
	flex: 1;
	overflow-y: auto !important;
	border: 1px solid #ECECEC
}

.error-container {
	background-color: red;
	color: white;
	height: 100%;
}

.gradient {
	background: linear-gradient(135deg, #C8FFB4, #F9FFB7) !important;
}

</style>
