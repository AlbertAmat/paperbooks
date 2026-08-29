<template>
	<div class="app-content">
		<!-- ================================================== -->
		<!-- PAGE BAR											-->
		<!-- ================================================== -->
		<v-toolbar
			color="white"
			density="comfortable"
			elevation="1"
			style="position: sticky; top: 0; left: 0; z-index: 2"
			class="px-5"
		>
			<!-- Page name -->
			<h4 style="font-size: 18px">{{ model.getPageName() }}</h4>

			<slot name="prepend"></slot>

			<v-spacer></v-spacer>

			<slot name="append"></slot>
		</v-toolbar>

		<v-container
			style="display: flex; flex-direction: column; flex: 1; min-height: 0"
		>
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

			<template v-else-if="model.hasData()">
				<slot></slot>
			</template>
		</v-container>
	</div>
</template>

<script setup lang="ts">
import {BaseController} from "@/controller/BaseController";

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
	min-height: 0;
}
</style>