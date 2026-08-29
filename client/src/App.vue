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
			<p>{{ applicationService.getError()!.message }}</p>
		</div>

		<template v-else>
			<!-- ================================================== -->
			<!-- APP MENU											-->
			<!-- ================================================== -->
			<app-menu/>

			<!-- ================================================== -->
			<!-- APP BAR											-->
			<!-- ================================================== -->
			<app-bar/>

			<v-main class="app-main" id="scroller">
				<!-- Content -->
				<router-view/>

				<!-- ================================================== -->
				<!-- APP DIALOGS										-->
				<!-- ================================================== -->
				<confirmation-dialog/>
				<app-snackbar/>
				<error-dialog/>
				<cookie-consent-dialog/>
			</v-main>

			<!-- ================================================== -->
			<!-- APP FOOTER											-->
			<!-- ================================================== -->
			<app-footer/>
		</template>
	</v-app>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import AppBar from "@/components/app/AppBar.vue";
import AppMenu from "@/components/app/AppMenu.vue";
import {applicationService} from "@/service/ApplicationService";
import ConfirmationDialog from "@/components/confirmationDialog/ConfirmationDialog.vue";
import AppSnackbar from "@/components/appSnackbar/AppSnackbar.vue";
import ErrorDialog from "@/components/errorDialog/ErrorDialog.vue";
import AppFooter from "@/components/app/AppFooter.vue";
import CookieConsentDialog from "@/components/cookieConsent/CookieConsentDialog.vue";

onMounted(() => {
	applicationService.fetchPolicy();
})
</script>

<style>
html, body {
	height: 100vh;
	overflow: hidden !important;
}

#app {
	height: 100%;
	overflow: hidden;
}

.app-main {
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: auto;
}

.app-main .v-main__wrap {
	display: flex !important;
	flex-direction: column;
	flex: 1;
}

.error-container {
	background-color: red;
	color: white;
	height: 100%;
}
</style>
