<template>
	<v-menu
		v-if="model"
		v-model="model"
		attach=".app-main"
		:close-on-content-click="false"
	>
		<v-card rounded width="500px">
			<v-card-title style="display:flex; align-items: center">
				<span>Print</span>

				<v-spacer/>

				<v-btn
					@click="model = false"
					variant="text"
					icon
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text style="display: flex; align-items: center">
				<div>
					Total labels to print: <b>{{controller.getTotalLabels()}}</b>
				</div>

				<v-spacer/>

				<v-btn
					@click="controller.cancel()"
					variant="text"
					icon
					color="red"
					class="mr-3"
				>
					<v-icon>mdi-close-circle</v-icon>
				</v-btn>

				<v-btn
					@click="controller.print()"
					color="primary"
					class="text-none"
				>
					Print
				</v-btn>
			</v-card-text>
		</v-card>
	</v-menu>
</template>

<script setup lang="ts">

import {printDialogController} from "@/components/printDialog/PrintDialogController";
import {computed} from "vue";

const controller = printDialogController;

const model = computed({
	get() {
		return controller.isVisible();
	},
	set(value: boolean) {
		controller.setVisible(value);
	}
})

</script>

<style scoped>

</style>