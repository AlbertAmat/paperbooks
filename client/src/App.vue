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

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import AppBar from "@/components/app/AppBar.vue";
import AppMenu from "@/components/app/AppMenu.vue";
import {applicationService} from "@/service/ApplicationService";
import ConfirmationDialog from "@/components/confirmationDialog/ConfirmationDialog.vue";

export default defineComponent({
	name: 'App',
	components: {
		ConfirmationDialog,
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

<style>
html, body {
	overflow-y: hidden;
	overflow-x: hidden;
	height: 100vh;
}

.app-main {
	overflow: hidden;
}

.app-main,
.app-content {
	background-color: #FAFAFA;
	overflow: hidden !important;
	height: 100vh;
}

.app-main  .v-main__wrap {
	display: flex !important;
	flex-direction: column;
	flex: 1;
	padding: 8px !important;
}


.app-content {
	width: 100%;
	border-radius: 8px;
	background-color: white;
	border: 1px solid #EFEFEF;
	position: relative;
	display: flex;
	flex-direction: column;
}

.error-container {
	background-color: red;
	color: white;
	height: 100%;
}

.app-border-1 {
	border: 1px solid #EFEFEF;
}

.app-border-2 {
	border: 2px solid #EFEFEF;
}
</style>
