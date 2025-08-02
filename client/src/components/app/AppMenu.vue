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
				style="font-weight: bold"
			>
				Paper Book
			</span>

			<v-spacer/>

			<v-btn
				v-if="!rail"
				@click="rail = true"
				icon
				variant="text"
				density="compact"
			>
				<v-icon>mdi-arrow-collapse-horizontal</v-icon>
			</v-btn>
		</div>

		<v-list
			v-model="selectedItem"
			color="#5b5b5b"
			:lines="false"
			density="compact"
			nav
			style="flex: 1; overflow-y: auto; display: flex; flex-direction: column"
		>
			<v-list-item
				v-for="(item, index) in items"
				:key="index+'-router'"
				nav
				:to="item.path"
				:value="item.path"
				:title="item.name"
				:prepend-icon="item.icon"
				density="compact"
				:style="{color: selectedItem === item.path ? 'black' : ''}"
			/>

			<div style="flex: 1"></div>
			<v-list-item
				nav
				to="xxxx"
				value="xxxx"
				title="Settings"
				prepend-icon="mdi-cog-outline"
			/>
		</v-list>
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
const rail: Ref<boolean> = ref(false);

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