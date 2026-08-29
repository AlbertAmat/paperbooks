<template>
	<div class="app-content">
		<!-- ================================================== -->
		<!-- PAGE BAR											-->
		<!-- ================================================== -->
		<v-toolbar
			color="white"
			density="compact"
			elevation="1"
			style="position: sticky; top: 0; left: 0; z-index: 2"
			class="px-5 page-toolbar"
		>
			<!-- Page name -->
			<h4 class="page-toolbar-title">{{ model.getPageName() }}</h4>

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

<style scoped lang="scss">
.app-content {
	position: relative;
	display: flex !important;
	flex-direction: column !important;
	flex: 1;
	min-height: 0;
}

.page-toolbar {
	height: 35px !important;

	:deep(.v-toolbar__content) {
		height: 35px !important;
		min-height: 35px !important;
	}

	.page-toolbar-title {
		margin: 0;
		font-size: 14px;
		line-height: 1;
		white-space: nowrap;
	}

	:deep(.v-btn) {
		height: 26px !important;
		min-height: 26px !important;
		font-size: 12px;

		&.v-btn--icon {
			width: 26px !important;
		}
	}

	:deep(.v-btn__content) {
		font-size: 12px;
	}

	:deep(.v-btn .v-icon) {
		font-size: 16px;
	}

	:deep(.v-chip) {
		height: 20px !important;
		font-size: 11px;
	}

	:deep(.v-divider--vertical) {
		margin-top: 4px;
		margin-bottom: 4px;
	}
}
</style>