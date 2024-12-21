<template>
	<v-app-bar
		app
		flat
		dense
	>
		<v-spacer></v-spacer>

		<v-autocomplete
			hide-details
			dense
			solo
			placeholder="Search book..."
		></v-autocomplete>

		<v-spacer></v-spacer>

		<div class="d-flex align-center">
			James sparrow

			<v-avatar
				class="elevation-1 ml-2"
				size="40"
			>
				<v-icon>mdi-account</v-icon>
			</v-avatar>

		</div>
	</v-app-bar>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: "AppBar",
	setup() {


		return {

		}
	}
});
</script>

<style scoped lang="scss">

</style>