<template>
	<page-component :model="controller">
		<template v-slot:default>
			<v-sheet class="legal-content-sheet pa-4">
				<h2>{{ activeDoc.title }}</h2>
				<legal-content :blocks="activeDoc.blocks"/>
			</v-sheet>
		</template>
	</page-component>
</template>

<script setup lang="ts">
import {computed, watch} from "vue";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import PageComponent from "@/views/PageComponent.vue";
import LegalContent from "@/components/legal/LegalContent.vue";
import LegalController from "@/controller/legal/LegalController";
import {getLegalDoc} from "@/views/legal/legalData";

const route = useRoute();
const {locale} = useI18n();
const controller = new LegalController();

const activeDoc = computed(() => getLegalDoc(route.params.document as string | undefined, locale.value));

watch(() => activeDoc.value.id, () => {
	document.querySelector(".legal-content-sheet")?.scrollTo({top: 0, behavior: "instant" as ScrollBehavior});
});
</script>

<style scoped lang="scss">

.legal-nav {
	width: 260px;
	flex-shrink: 0;
	height: 100%;
	overflow-y: auto;
}

.legal-content-sheet {
	flex: 1;
	min-width: 0;
	max-width: 820px;
	height: 100%;
	overflow-y: auto;
	padding-bottom: 60px !important;
}
</style>
