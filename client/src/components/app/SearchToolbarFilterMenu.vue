<template>
	<v-menu
		v-if="activeSearchController"
		v-model="filterMenu"
		:close-on-content-click="false"
	>
		<template v-slot:activator="{ props }">
			<v-btn
				v-bind="props"
				icon
				variant="text"
				density="compact"
				:color="hasActiveFilters ? 'primary' : undefined"
			>
				<v-icon size="20">mdi-filter-variant</v-icon>
			</v-btn>
		</template>

		<v-card min-width="260" class="pa-2">
			<div class="text-caption text-medium-emphasis px-2 pt-1">{{ t(AppLabels.ADD_FILTER) }}</div>
			<v-list density="compact">
				<v-list-item
					v-for="f in filterOptions"
					:key="f.value"
					@click="toggleFilter(f.value)"
				>
					<template v-slot:prepend>
						<v-icon size="18">{{ isFilterActive(f.value) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}</v-icon>
					</template>
					<v-list-item-title>{{ f.title }}</v-list-item-title>
				</v-list-item>
			</v-list>

			<v-divider class="my-2"/>

			<div class="px-2 pb-2">
				<div class="text-caption text-medium-emphasis mb-2">{{ t(AppLabels.UPLOAD_DATE_FILTER) }}</div>
				<v-text-field
					v-model="dateFromInput"
					:label="t(AppLabels.DATE_FROM)"
					type="date"
					density="compact"
					hide-details
					class="mb-3"
				/>
				<v-text-field
					v-model="dateToInput"
					:label="t(AppLabels.DATE_TO)"
					type="date"
					density="compact"
					hide-details
				/>
				<div class="d-flex justify-end mt-3">
					<v-btn variant="text" class="text-none mr-2" @click="clearDateRange">{{t(AppLabels.CLEAR)}}</v-btn>
					<v-btn color="primary" class="text-none" @click="applyDateRange">{{t(AppLabels.APPLY)}}</v-btn>
				</div>
			</div>
		</v-card>
	</v-menu>
</template>

<script setup lang="ts">
/**
 * Filter icon + menu docked in the global search box (see `AppBar.vue`),
 * self-contained the same way `BarcodeScanner.vue` is - Vuetify's `v-menu`
 * overlay breaks when inlined directly inside a `v-text-field`'s
 * `append-inner` slot template, so it's split out into its own component
 * instead (matches the working pattern already used for the barcode button).
 * Only rendered while the library page is mounted (see `activeSearchController`),
 * driving that page's own `SearchController` directly.
 */
import {computed, ref, Ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import {activeSearchController} from "@/controller/search/SearchController";
import {SearchFilter} from "@/types/search/SearchFilter";

const {t} = useI18n();

const filterMenu: Ref<boolean> = ref(false);
const dateFromInput: Ref<string | null> = ref(null);
const dateToInput: Ref<string | null> = ref(null);

const filterOptions = [
	{title: t(AppLabels.NO_STOCK_FILTER), value: SearchFilter.NO_STOCK},
	{title: t(AppLabels.HAS_STOCK_FILTER), value: SearchFilter.HAS_STOCK},
	{title: t(AppLabels.ON_LOAN_FILTER), value: SearchFilter.ON_LOAN},
	{title: t(AppLabels.RECENT_FILTER), value: SearchFilter.RECENT}
];

const hasActiveFilters = computed(() => activeSearchController.value?.hasActiveFilters() ?? false);

function isFilterActive(filter: SearchFilter): boolean {
	return activeSearchController.value?.getFilters().includes(filter) ?? false;
}

function toggleFilter(filter: SearchFilter) {
	const controller = activeSearchController.value;
	if (!controller) return;
	if (controller.getFilters().includes(filter)) {
		controller.removeFilter(filter);
	} else {
		controller.addFilter(filter);
	}
}

// Reset the date draft to whatever's actually active each time the menu opens.
watch(filterMenu, (open) => {
	if (open && activeSearchController.value) {
		dateFromInput.value = activeSearchController.value.getDateFrom();
		dateToInput.value = activeSearchController.value.getDateTo();
	}
});

function applyDateRange() {
	activeSearchController.value?.setDateRange(dateFromInput.value || null, dateToInput.value || null);
	filterMenu.value = false;
}

function clearDateRange() {
	dateFromInput.value = null;
	dateToInput.value = null;
	activeSearchController.value?.clearDateRange();
}
</script>
