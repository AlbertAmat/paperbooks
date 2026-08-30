<template>
	<v-navigation-drawer
		v-model="menu"
		v-model:rail="rail"
		app
		width="240"
		class="app-menu"
		:expand-on-hover="railEnabled"
		permanent
		:dark="true"
	>
		<div class="d-flex align-center pt-4 pb-3 ml-1 app-menu-header pr-1 pl-4">
			<v-avatar color="primary" rounded="lg" size="32">
				<v-icon color="white" size="20">
					mdi-book-open-page-variant
				</v-icon>
			</v-avatar>

			<!-- APP TITLE -->
			<span
				class="mx-2 app-menu-title pb-display"
				:class="{'app-menu-title--visible': !rail}"
			>
				Paper Book
			</span>
		</div>

		<v-list
			v-model="selectedItem"
			:lines="false"
			density="compact"
			slim
			nav
			class="app-menu-list"
		>
			<v-list-item
				v-for="(item, index) in items"
				:key="index"
				nav
				:to="item.path"
				:value="item.path"
				:title="item.name"
				:prepend-icon="item.icon"
				density="compact"
				class="app-menu-item"
			/>
		</v-list>

		<div style="width: 100%;" class="pb-3">
			<v-divider class="app-menu-divider mb-2"></v-divider>

			<print-dialog/>

			<v-list-item
				nav
				:to="docsRoute.getPath()"
				title="Help"
				prepend-icon="mdi-help-circle-outline"
				density="compact"
				class="mx-2 app-menu-item"
			/>
		</div>
	</v-navigation-drawer>
</template>

<script setup lang="ts">
/**
 * Left-hand navigation drawer: links to every top-level view, plus the print
 * queue and help/docs. Stays fully expanded by default; if the user turns on
 * "Compact menu" in Settings (`users.sidebar_rail`, off by default) it
 * collapses to icon-only "rail" mode instead, expanding again on hover.
 * Styled as a dark "shelf frame" (see --pb-nav-* tokens) in both themes -
 * like the frame of a bookshelf standing in a bright or dim room.
 */
import {computed, Ref, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {applicationService} from "@/service/ApplicationService";
import {dashboardRoute} from "@/router/routes/DashboardRoute";
import {searchRoute} from "@/router/routes/SearchRoute";
import {locationsRoute} from "@/router/routes/LocationsRoute";
import {categoriesRoute} from "@/router/routes/CategoriesRoute";
import {customersRoute} from "@/router/routes/CustomersRoute";
import {authorsRoute} from "@/router/routes/AuthorsRoute";
import {docsRoute} from "@/router/routes/DocsRoute";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import PrintDialog from "@/components/printDialog/PrintDialog.vue"

const route = useRoute()

const {t} = useI18n();

/**
 *
 */
const selectedItem: Ref<string | null> = ref(null);

/**
 *
 */
const menu: Ref<boolean> = ref(true);

/** Whether rail (icon-only, expand-on-hover) mode is enabled - the user's saved Settings preference. Off by default. */
const railEnabled = computed(() => applicationService.getUser().isSidebarRail());

const rail: Ref<boolean> = ref(railEnabled.value);

// Keep the drawer in sync if the user toggles the preference in Settings
// without a page reload: rail mode fully off means always expanded.
watch(railEnabled, (enabled) => {
	rail.value = enabled;
});

/**
 *
 */
const items = [
	{
		name: t(AppLabels.DASHBOARD),
		icon: "mdi-chart-box-outline",
		path: dashboardRoute.getPath()
	},
	{
		name: t(AppLabels.LIBRARY),
		icon: "mdi-bookshelf",
		path: searchRoute.getPath()
	},
	{
		name: t(AppLabels.LOCATIONS),
		icon: "mdi-map-marker-radius",
		path: locationsRoute.getPath()
	},
	{
		name: t(AppLabels.CATEGORIES),
		icon: "mdi-shape-outline",
		path: categoriesRoute.getPath()
	},
	{
		name: t(AppLabels.CUSTOMERS),
		icon: "mdi-account-school-outline",
		path: customersRoute.getPath()
	},
	{
		name: t(AppLabels.AUTHORS),
		icon: "mdi-account-tie",
		path: authorsRoute.getPath()
	}
]

watch(() => route.path, (path) => {
	selectedItem.value = path || null;
}, {immediate: true})

</script>

<style scoped>
.app-menu {
	background: var(--pb-nav-bg) !important;
	color: var(--pb-nav-text);
	border-right: 1px solid var(--pb-nav-border-strong) !important;
}

.app-menu-header {
	transition: padding 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-menu-title {
	white-space: nowrap;
	overflow: hidden;
	opacity: 0;
	transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	flex: 1;
	font-weight: 600;
	font-size: 17px;
	color: var(--pb-nav-text);
}

.app-menu-title--visible {
	opacity: 1;
}

.app-menu-list {
	flex: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	padding-top: 4px;
}

.app-menu-item {
	border-radius: 10px;
	margin: 2px 8px;
	color: var(--pb-nav-text-muted);
}

.app-menu-divider {
	border-color: var(--pb-nav-border) !important;
}

.app-menu :deep(.v-list-item--active) {
	background: var(--pb-nav-active-bg);
	color: var(--pb-nav-accent);
	font-weight: 600;
	border-left: 3px solid var(--pb-nav-accent);
	padding-left: calc(var(--v-list-item-padding-left, 16px) - 3px) !important;
}

.app-menu :deep(.v-list-item--active .v-icon) {
	color: var(--pb-nav-accent);
}

.app-menu >>> .v-navigation-drawer__border {
	display: none;
}

.app-menu >>> .v-navigation-drawer__content {
	display: flex;
	flex-direction: column;
}
</style>
