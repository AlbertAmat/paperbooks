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

			<v-main class="app-main">
				<v-container
					class="app-content pt-2"
					fluid
				>
					<!-- ================================================== -->
					<!-- APP BAR											-->
					<!-- ================================================== -->
					<app-bar/>

					<div id="scroller" style="flex: 1; overflow-y: auto; padding-top: 10px; margin-top: 4px">
						<router-view></router-view>

						<confirmation-dialog/>
					</div>
				</v-container>
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
.app-main {
	overflow: auto;
	height: 100%;
}

.app-main  .v-main__wrap {
	display: flex !important;
	flex-direction: column;
	flex: 1;
}

.app-content {
	position: relative;
	display: flex;
	flex-direction: column;
}

.error-container {
	background-color: red;
	color: white;
	height: 100%;
}

</style>
