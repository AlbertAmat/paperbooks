<template>
	<v-navigation-drawer
		v-model="menu"
		app
		:mini-variant.sync="mini"
		width="235px"
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
				class="ml-2"
				style="font-weight: bold"
			>
				Book Storage
			</span>

			<v-spacer/>

			<span style="font-size: 12px; color: grey">v1.0</span>
		</div>

		<v-list
			dense
			nav
			subheader
			style="flex: 1"
		>
			<v-list-item-group
				v-model="selectedItem"
				color="primary"
			>
				<template 	v-for="(item, index) in items">
					<v-subheader
						v-if="item.subheader"
						:key="index"
						style="font-size: 12px"
					>
						{{item.subheader}}
					</v-subheader>

					<router-link
						v-else
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
				</template>
			</v-list-item-group>
		</v-list>

		<!-- App storage -->
		<div
			class="app-border-1 ml-2 mb-2 mt-2 pa-2"
			style="background-color: white; border-radius: 8px"
		>
			<h4 class="mb-3">Storage</h4>
			<v-progress-linear
				:value="size"
				height="10px"
				style="border-radius: 6px"
			></v-progress-linear>

			<p class="mt-2 mb-0" style="font-size: 12px; color: grey">{{formatSizeMB(applicationService.getDatabaseSize())}} of {{formatSizeMB(applicationService.getDatabaseMaxSize())}} used</p>
		</div>
	</v-navigation-drawer>
</template>

<script lang="ts">
import {computed, defineComponent, getCurrentInstance, Ref, ref, watch} from "vue";
import {RoutePaths} from "@/router/Router";
import {applicationService} from "@/service/ApplicationService";

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
				subheader: "Administration"
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

		watch(() => root?.proxy.$route.path, (path) => {
			selectedItem.value = path || null;
		}, {immediate: true})

		watch(() => root?.proxy.$vuetify.breakpoint.width, (width) => {
			mini.value =  width ? width < 900 : false;
		}, {immediate: true})

		return {
			items,
			selectedItem,
			mini,
			menu,
			applicationService,
			formatSizeMB,
			size
		}
	}
})
</script>

<style scoped>
.app-menu >>> .v-navigation-drawer__border{
	display: none;
}

.app-menu >>> .v-navigation-drawer__content{
	display: flex;
	flex-direction: column;
}
</style>