<template>
	<div class="not-found-view">
		<div class="text-center">
			<v-icon size="48" color="var(--pb-accent)" class="mb-2">mdi-book-remove-outline</v-icon>
			<h1 class="not-found-title pb-display">404</h1>
			<p class="not-found-desc">{{t(AppLabels.NOT_FOUND_DESC)}}</p>
			<v-btn
				@click="goToHome()"
				color="primary"
				variant="elevated"
				class="text-none mt-4"
			>
				{{t(AppLabels.NOT_FOUND_GO_HOME)}}
			</v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
/** 404 page, rendered by the router's catch-all route (see `NotFoundRoute.ts`). */
import router from "@/router/Router";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

const {t} = useI18n();

function goToHome() {
	router.push("/");
}
</script>

<style scoped lang="scss">
.not-found-view {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	background: var(--pb-bg);
}

.not-found-title {
	font-size: 56px;
	font-weight: 600;
	color: var(--pb-text);
	margin: 0;
}

.not-found-desc {
	color: var(--pb-text-muted);
	max-width: 320px;
}
</style>
