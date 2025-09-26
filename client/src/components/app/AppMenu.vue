<template>
	<v-navigation-drawer
		v-model="menu"
		:rail="expanded"
		app
		border="0"
		width="230"
		class="app-menu"
		expand-on-hover
		permanent
		color="#011a38"
		:dark="true"
	>
		<div class="d-flex align-center py-3 ml-1" :class="expanded ? 'px-1' : 'px-3'">
			<v-avatar color="primary" rounded>
				<v-icon color="white">
					mdi-book-open
				</v-icon>
			</v-avatar>

			<!-- APP TITLE -->
			<span
				class="mx-2"
				style="font-weight: bold; flex: 1; color: white"
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
				:disabled="true"
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
const expanded: Ref<boolean> = ref(true);

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

.app-menu >>> .v-navigation-drawer__border {
	display: none;
}

.app-menu >>> .v-navigation-drawer__content {
	display: flex;
	flex-direction: column;
}
</style>