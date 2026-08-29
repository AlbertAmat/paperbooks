<template>
	<v-navigation-drawer
		v-model="menu"
		v-model:rail="rail"
		app
		border="0"
		width="230"
		class="app-menu"
		expand-on-hover
		permanent
		color="#011a38"
		:dark="true"
	>
		<div class="d-flex align-center pt-3 pb-2 ml-1 app-menu-header pr-1 pl-2" >
			<v-avatar color="primary" rounded size="30">
				<v-icon color="white" size="20">
					mdi-book-open
				</v-icon>
			</v-avatar>

			<!-- APP TITLE -->
			<span
				class="mx-2 app-menu-title"
				:class="{'app-menu-title--visible': !rail}"
				style="font-weight: bold; flex: 1; color: white"
			>
				Paper Book
			</span>
		</div>

		<v-divider class="mt-0"></v-divider>

		<v-list
			v-model="selectedItem"
			:lines="false"
			density="compact"
			slim
			nav
			style="flex: 1; overflow-y: auto; display: flex; flex-direction: column;"
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
				:style="{'font-weight': selectedItem == item.path ? 'bold !important' : ''}"
			/>
		</v-list>

		<div style="width: 100%;" class="pb-3">
			<print-dialog/>

			<v-list-item
				nav
				:to="docsRoute.getPath()"
				title="Help"
				prepend-icon="mdi-help-circle-outline"
				density="compact"
				class="mx-2"
			/>
		</div>
	</v-navigation-drawer>
</template>

<script setup lang="ts">
import {Ref, ref, watch} from "vue";
import {useRoute} from "vue-router";
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
const rail: Ref<boolean> = ref(true);

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
	color: white;
}

.app-menu-header {
	transition: padding 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-menu-title {
	white-space: nowrap;
	overflow: hidden;
	opacity: 0;
	transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-menu-title--visible {
	opacity: 1;
}

.app-menu >>> .v-navigation-drawer__border {
	display: none;
}

.app-menu >>> .v-navigation-drawer__content {
	display: flex;
	flex-direction: column;
}
</style>