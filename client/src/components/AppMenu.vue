<template>
	<v-navigation-drawer
		app
		permanent
		:mini-variant.sync="mini"
		width="235px"
		class="app-menu"
	>
		<div class="d-flex align-center justify-center px-3 py-3">
			<v-icon
				color="primary"
			>
				mdi-book-open
			</v-icon>

			<!-- APP TITLE -->
			<span
				v-if="!mini"
				class="ml-2"
				style="font-weight: bold"
			>
				Book Storage
			</span>

		</div>
		<v-divider></v-divider>

		<v-list
			dense
			nav
		>
			<v-list-item-group v-model="selectedItem" color="primary">
				<router-link
					v-for="(item, index) in items"
					:key="index"
					:to="item.path"
					style="text-decoration: none"
				>
					<v-list-item
						:value="item.path"
						:title="item.name"
						dense
					>
						<v-list-item-icon class="mr-2">
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-item-icon>

						<v-list-item-content>
							<v-list-item-title>{{ item.name }}</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</router-link>
			</v-list-item-group>
		</v-list>
	</v-navigation-drawer>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, Ref, ref, watch} from "vue";
import {RoutePaths} from "@/router/Router";

export default defineComponent({
	name: "AppMenu",
	setup() {

		const root = getCurrentInstance();

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
				path: ""
			},
			{
				name: "Languages",
				icon: "mdi-flag-outline",
				path: ""
			},
			{
				name: "Categories",
				icon: "mdi-shape-outline",
				path: ""
			},
			{
				name: "Users",
				icon: "mdi-account-group-outline",
				path: ""
			},
			{
				name: "Settings",
				icon: "mdi-cog-outline",
				path: ""
			},
		]

		watch(() => root?.proxy.$route.path, (path) => {
			selectedItem.value = path || null;
		}, {immediate: true})

		watch(() => root?.proxy.$vuetify.breakpoint.width, (width) => {
			mini.value =  width ? width < 900 : false;
		}, {immediate: true})

		return {
			items,
			selectedItem,
			mini
		}
	}
})
</script>

<style scoped>
</style>