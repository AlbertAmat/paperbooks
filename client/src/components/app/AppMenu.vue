<template>
	<v-navigation-drawer
		:rail="rail"
		app
		border="0"
		width="230"
		class="app-menu"
	>
		<div class="d-flex align-center py-3 ml-1" :class="rail ? 'px-1' : 'px-3'">
			<v-avatar class="gradient" rounded>
				<v-icon color="#4b4b4b">
					mdi-book-open
				</v-icon>
			</v-avatar>

			<!-- APP TITLE -->
			<span
				v-if="!rail"
				class="mx-2"
				style="font-weight: bold; flex: 1"
			>
				Paper Book
			</span>
		</div>

		<v-list
			v-model="selectedItem"
			color="#5b5b5b"
			:lines="false"
			density="compact"
			slim
			nav
			style="flex: 1; overflow-y: auto; display: flex; flex-direction: column"
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
				:style="{color: selectedItem === item.path ? 'black' : ''}"
			/>
		</v-list>

		<div style="display: flex; width: 100%; justify-content: center">
			<v-spacer v-if="!rail"></v-spacer>
			<v-btn
				icon
				variant="text"
				density="comfortable"
				@click="rail = !rail"
				:class="!rail ? 'mr-3' : ''"
				nav
			>
				<v-icon size="25">{{ rail ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
			</v-btn>
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

const route = useRoute()

const {t} = useI18n();

/**
 *
 */
const selectedItem: Ref<string | null> = ref(null);

/**
 *
 */
const rail: Ref<boolean> = ref(false);

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
	background-color: transparent !important;
}

.app-menu >>> .v-navigation-drawer__border {
	display: none;
}

.app-menu >>> .v-navigation-drawer__content {
	display: flex;
	flex-direction: column;
}
</style>