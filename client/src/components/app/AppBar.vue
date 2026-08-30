<template>
	<v-app-bar
		app
		density="compact"
		class="px-5 app-bar"
		border
		:elevation="0"
	>
		<v-text-field
			v-model="searchInput"
			:placeholder="t(AppLabels.SEARCH_BOOKS)"
			density="compact"
			:details="false"
			hide-details
			clearable
			prepend-inner-icon="mdi-magnify"
			variant="solo"
			flat
			rounded="pill"
			@keydown.enter="doSearch()"
			class="app-bar-search"
		>
			<template v-slot:append-inner>
				<search-toolbar-filter-menu/>
				<barcode-scanner @value="searchBarcode"/>
			</template>
		</v-text-field>

		<v-spacer></v-spacer>

		<user-menu/>
	</v-app-bar>
</template>

<script setup lang="ts">
/**
 * Top app bar: the global book search box (typed or via barcode scan) and
 * the user menu. Submitting navigates to the search/library route with the
 * query string set, letting `SearchController` pick it up.
 */
import {ref, Ref} from "vue";
import {SearchRoute, searchRoute} from "@/router/routes/SearchRoute";
import router from "@/router/Router";
import UserMenu from "@/components/app/UserMenu.vue";
import BarcodeScanner from "@/components/barcodeScanner/BarcodeScanner.vue";
import SearchToolbarFilterMenu from "@/components/app/SearchToolbarFilterMenu.vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

const {t} = useI18n();

const params = router.currentRoute.value.query;
const query = params[SearchRoute.QUERY_PARAM] ? params[SearchRoute.QUERY_PARAM] as string || "" : "";

const searchInput: Ref<string> = ref(query);

function doSearch() {
	const search = searchInput.value.trim();
	router.push(searchRoute.getPath(search));
}

function searchBarcode(value: string) {
	searchInput.value = value;
	doSearch()
}
</script>

<style scoped lang="scss">
.app-bar {
	background: var(--pb-surface) !important;
	border-color: var(--pb-border) !important;
}

.app-bar :deep(.v-toolbar__content) {
	position: relative;
}

.app-bar-search {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	max-width: 340px;
}

.app-bar-search :deep(.v-field) {
	background: var(--pb-surface-alt);
	border: 1px solid var(--pb-border);
}
</style>