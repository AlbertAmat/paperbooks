<template>
	<div style="display: flex">
		<v-menu>
			<template v-slot:activator="{ props }">
				<v-btn
					v-bind="props"
					class="text-none"
					elevation="0"
					style=" border: 1px solid #ECECEC"
				>
					<v-icon class="mr-2" size="22">mdi-plus</v-icon>
					{{t(AppLabels.ADD_FILTER)}}
				</v-btn>
			</template>
			<v-list>
				<v-list-item
					v-for="(item, index) in filters"
					:key="index"
					:value="item.value"
					@click="model.addFilter(item.value)"
				>
					<v-list-item-title>{{ item.title }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>

		<v-chip
			v-for="filter in selectedFilters"
			label
			class="ml-2"
			closable
			color="primary"
			style="height: 100%"
			@click:close="model.removeFilter(filter.value)"
		>{{ filter.title }}</v-chip>
	</div>
</template>

<script setup lang="ts">
/** Search view's filter picker: a menu to add a `SearchFilter` and chips to remove active ones, delegating state to `SearchController`. */
import SearchController from "@/controller/search/SearchController";
import {SearchFilter} from "@/types/search/SearchFilter";
import {computed} from "vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "../../../plugins/i18n/AppLabels";

interface Props {
	model: SearchController
}

const props = defineProps<Props>();

const {t} = useI18n();

const filters = [
	{
		title: t(AppLabels.NO_STOCK_FILTER),
		value: SearchFilter.NO_STOCK
	},
	{
		title: t(AppLabels.HAS_STOCK_FILTER),
		value: SearchFilter.HAS_STOCK
	}
]

const selectedFilters = computed(() => {
	return props.model.getFilters().map((filterValue) => {
		return filters.find((filter) => filter.value == filterValue) as Record<string, any>
	})
})
</script>
