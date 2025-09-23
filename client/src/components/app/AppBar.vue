<template>
	<!-- Page name -->
	<h4 style="font-size: 18px">{{ pageName }}</h4>

	<slot name="prepend"></slot>

	<v-spacer></v-spacer>

	<v-text-field
		v-model="searchInput"
		:placeholder="t(AppLabels.SEARCH_BOOKS)"
		density="compact"
		:details="false"
		hide-details
		prepend-inner-icon="mdi-magnify"
		variant="solo-filled"
		@keydown.enter="doSearch()"
	>
		<template v-slot:append-inner>
			<barcode-scanner @value="searchBarcode"/>
		</template>
	</v-text-field>

	<v-spacer></v-spacer>

	<slot name="append"></slot>

	<user-menu/>
</template>

<script setup lang="ts">
import {computed, ref, Ref} from "vue";
import {useRoute} from "vue-router";
import {SearchRoute, searchRoute} from "@/router/routes/SearchRoute";
import router from "@/router/Router";
import UserMenu from "@/components/app/UserMenu.vue";
import BarcodeScanner from "@/components/barcodeScanner/BarcodeScanner.vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

interface Props {
	title:  string;
}

const props = defineProps<Props>()

const route = useRoute()

const {t} = useI18n();

const pageName = computed(() => {
	return props.title || route.name;
})

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