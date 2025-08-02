<template>
	<v-card class="app-content my-2 mr-1">
		<!-- ================================================== -->
		<!-- APP BAR											-->
		<!-- ================================================== -->
		<v-card-title style="display: flex; align-items: center; font-size: 14px">
			<app-bar>
				<template v-slot:prepend>
					<slot name="prepend"/>
				</template>

				<template v-slot:append>
					<slot name="append"/>
				</template>
			</app-bar>
		</v-card-title>

		<v-card-text id="scroller" style="overflow-y: auto; display: flex; flex-direction: column; flex: 1">
			<v-overlay
				v-if="model.isLoading()"
				:opacity="0"
				absolute
			>
				<v-progress-circular
					color="primary"
					indeterminate
				/>
			</v-overlay>

			<v-alert
				v-else-if="model.hasError()"
				type="error"
			>
				{{ model.getError().message }}
			</v-alert>

			<template v-else>
				<slot></slot>
			</template>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import {BaseController} from "@/controller/BaseController";
import AppBar from "@/components/app/AppBar.vue";

interface Props {
	model: BaseController<any>
}

const props = defineProps<Props>()

</script>

<style scoped>
.app-content {
	position: relative;
	display: flex !important;
	flex-direction: column !important;
	flex: 1;
	overflow-y: auto !important;
	border: 1px solid #ECECEC
}
</style>