<template>
	<div class="app-content">
		<!-- ================================================== -->
		<!-- PAGE BAR											-->
		<!-- ================================================== -->
		<v-toolbar
			density="compact"
			elevation="0"
			style="position: sticky; top: 0; left: 0; z-index: 2"
			class="px-6 page-toolbar"
		>
			<!-- Page name -->
			<h4 class="page-toolbar-title pb-display">{{ model.getPageName() }}</h4>

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
/**
 * Standard page shell used by every top-level view: a sticky toolbar
 * (page title + `prepend`/`append` action slots) and a content area that
 * shows a loading spinner, an error alert, or the default slot, driven by
 * the given `BaseController` subclass's state.
 */
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
	min-height: 100%;
}

.page-toolbar {
	height: 52px !important;
	background: var(--pb-surface) !important;
	border-bottom: 1px solid var(--pb-border);

	:deep(.v-toolbar__content) {
		height: 52px !important;
		min-height: 52px !important;
	}

	.page-toolbar-title {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		line-height: 1;
		white-space: nowrap;
		color: var(--pb-text);
	}

	:deep(.v-btn) {
		height: 32px !important;
		min-height: 32px !important;
		font-size: 13px;

		&.v-btn--icon {
			width: 32px !important;
		}
	}

	:deep(.v-btn__content) {
		font-size: 13px;
	}

	:deep(.v-btn .v-icon) {
		font-size: 18px;
	}

	:deep(.v-chip) {
		height: 22px !important;
		font-size: 11px;
	}

	:deep(.v-divider--vertical) {
		margin-top: 4px;
		margin-bottom: 4px;
	}
}
</style>