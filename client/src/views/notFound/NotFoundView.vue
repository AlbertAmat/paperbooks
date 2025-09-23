<template>
	<div class="not-found-view">
		<div>
			<h1 class="text-center" style="font-size: 60px">404</h1>
			<p>{{t(AppLabels.NOT_FOUND_DESC)}}</p>
			<v-btn
				@click="goToHome()"
				color="primary"
				block
				class="text-none mt-4 gradient"
			>
				{{t(AppLabels.NOT_FOUND_GO_HOME)}}
			</v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
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
}
</style>