<template>
	<v-app-bar
		app
		density="compact"
		class="px-5"
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
			variant="underlined"
			@keydown.enter="doSearch()"
			style="max-width: 30%"
		>
			<template v-slot:append-inner>
				<barcode-scanner @value="searchBarcode"/>
			</template>
		</v-text-field>

		<v-spacer></v-spacer>

		<user-menu/>
	</v-app-bar>
</template>

<script setup lang="ts">
import {ref, Ref} from "vue";
import {SearchRoute, searchRoute} from "@/router/routes/SearchRoute";
import router from "@/router/Router";
import UserMenu from "@/components/app/UserMenu.vue";
import BarcodeScanner from "@/components/barcodeScanner/BarcodeScanner.vue";
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
	display: flex;
	align-items: center;
	z-index: 2;
	position: sticky;
	left: 0;
	top: 0;
}
</style>