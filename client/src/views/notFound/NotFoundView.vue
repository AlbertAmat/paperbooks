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

<script lang="ts">
import {defineComponent} from 'vue'
import router from "@/router/Router";

export default defineComponent({
	name: "NotFoundView",
	setup() {

		function goToHome() {
			router.push("/");
		}

		return {
			goToHome
		}
	}
})
</script>

<style scoped lang="scss">
.not-found-view {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}
</style>