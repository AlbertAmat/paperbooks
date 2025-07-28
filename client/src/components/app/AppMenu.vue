<template>
	<v-navigation-drawer
		v-model="menu"
		app
		:mini-variant.sync="mini"
		width="235"
		color="#FAFAFA"
		class="app-menu"
	>
		<div class="d-flex align-center px-3 py-3 ml-1">
			<v-icon
				color="primary"
			>
				mdi-book-open
			</v-icon>

			<!-- APP TITLE -->
			<span
				v-if="!mini"
				class="mx-2"
				style="font-weight: bold"
			>
				Book Storage
			</span>

			<v-spacer/>

			<span style="font-size: 12px; color: grey">v1.0</span>
		</div>

		<v-list
			v-model="selectedItem"
			color="primary"
			nav
			density="compact"
			style="flex: 1; overflow: auto"
		>
			<template v-for="(item, index) in items">
				<v-list-subheader
					v-if="item.subheader"
					:key="index"
					style="font-size: 12px"
				>
					{{ item.subheader }}
				</v-list-subheader>

				<v-list-item
					v-else
					:key="index+'-router'"
					:to="item.path"
					:value="item.path"
					:title="item.name"
					:prepend-icon="item.icon"
				/>
			</template>
		</v-list>

		<!-- App storage -->
		<div
			class="app-border-1 mx-2 mb-2 mt-2 pa-2"
			style="background-color: white; border-radius: 8px"
		>
			<h4 class="mb-3">Storage</h4>
			<v-progress-linear
				:value="size"
				height="10px"
				style="border-radius: 6px"
			></v-progress-linear>

			<p class="mt-2 mb-0" style="font-size: 12px; color: grey">
				{{ formatSizeMB(applicationService.getDatabaseSize()) }} of
				{{ formatSizeMB(applicationService.getDatabaseMaxSize()) }} used</p>
		</div>
	</v-navigation-drawer>
</template>

<script setup lang="ts">
import {computed, getCurrentInstance, Ref, ref, watch} from "vue";
import {RoutePaths} from "@/router/Router";
import {applicationService} from "@/service/ApplicationService";
import {useRoute} from "vue-router";
import {useDisplay} from "vuetify";

const root = getCurrentInstance();

const route = useRoute()
const {width} = useDisplay()

/**
 *
 */
const selectedItem: Ref<string | null> = ref(null);

/**
 *
 */
const mini: Ref<boolean> = ref(false);

/**
 *
 */
const items = [
	{
		name: "Overview",
		icon: "mdi-chart-box-outline",
		path: RoutePaths.OVERVIEW
	},
	{
		name: "Books",
		icon: "mdi-bookshelf",
		path: RoutePaths.SEARCH_BOOKS
	},
	{
		name: "Locations",
		icon: "mdi-map-marker-radius",
		path: RoutePaths.NOT_FOUND
	},
	{
		name: "Languages",
		icon: "mdi-flag-outline",
		path: RoutePaths.NOT_FOUND
	},
	{
		name: "Categories",
		icon: "mdi-shape-outline",
		path: RoutePaths.NOT_FOUND
	},
	{
		name: "Customers",
		icon: "mdi-account-school-outline",
		path: RoutePaths.NOT_FOUND
	},
	{
		subheader: "Administration"
	},
	{
		name: "Users",
		icon: "mdi-account-group-outline",
		path: RoutePaths.NOT_FOUND
	},
	{
		name: "Settings",
		icon: "mdi-cog-outline",
		path: RoutePaths.NOT_FOUND
	},
]

const menu = computed({
	get() {
		return applicationService.getMenu();
	},
	set(val: boolean) {
		applicationService.setMenu(val);
	}
})

const size = computed(() => {
	const currentSize = applicationService.getDatabaseSize();
	const maxSize = applicationService.getDatabaseMaxSize();

	// Avoid division by zero
	if (!currentSize || !maxSize || maxSize === 0) {
		return 0;
	}

	return (currentSize / maxSize) * 100;
})

function formatSizeMB(sizeMB: number) {
	const units = ["MB", "GB", "TB", "PB", "EB"];
	let unitIndex = 0;

	while (sizeMB >= 1024 && unitIndex < units.length - 1) {
		sizeMB /= 1024;
		unitIndex++;
	}

	return `${sizeMB.toFixed(0)} ${units[unitIndex]}`;
}

watch(() => route.path, (path) => {
	selectedItem.value = path || null;
}, {immediate: true})

watch(() => width.value, (width) => {
	mini.value = width ? width < 900 : false;
}, {immediate: true})
</script>

<style scoped>
.app-menu >>> .v-navigation-drawer__border {
	display: none;
}

.app-menu >>> .v-navigation-drawer__content {
	display: flex;
	flex-direction: column;
}
</style>