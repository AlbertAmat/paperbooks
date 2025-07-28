<template>
	<div class="not-found-view">
		<div>
			<h1 class="text-center" style="font-size: 60px">404</h1>
			<p>The page was not found.</p>
			<v-btn
				@click="goToHome()"
				text
				block
				color="primary"
				class="text-none"
			>
				Go to home
			</v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
import router from "@/router/Router";

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