<template>
	<page-component :model="controller">
		<template v-slot:default>
			<div class="docs-view">
				<v-list
					:lines="false"
					density="compact"
					nav
					class="docs-nav"
				>
					<v-list-subheader>{{ uiLabels.sidebarHeading }}</v-list-subheader>

					<v-list-item
						v-for="section in docSections"
						:key="section.id"
						:active="section.id === activeSection.id"
						:prepend-icon="section.icon"
						:title="section.title"
						density="compact"
						rounded="lg"
						color="primary"
						@click="selectSection(section.id)"
					/>
				</v-list>

				<v-sheet class="docs-content pa-4">
					<markdown-viewer :source="activeSection.content" @anchor-not-found="onAnchorNotFound"/>
				</v-sheet>
			</div>
		</template>
	</page-component>
</template>

<script setup lang="ts">
import {computed, watch} from "vue";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import router from "@/router/Router";
import PageComponent from "@/views/PageComponent.vue";
import MarkdownViewer from "@/components/markdown/MarkdownViewer.vue";
import DocsController from "@/controller/docs/DocsController";
import {getDocSection, getDocSections, docsUiLabels, normalizeDocLocale} from "@/views/docs/docsData";
import {docsRoute} from "@/router/routes/DocsRoute";

const route = useRoute();
const {locale} = useI18n();
const controller = new DocsController();

const docSections = computed(() => getDocSections(locale.value));
const activeSection = computed(() => getDocSection(route.params.section as string | undefined, locale.value));
const uiLabels = computed(() => docsUiLabels[normalizeDocLocale(locale.value)]);

function selectSection(id: string) {
	router.push(docsRoute.getPath(id));
}

function onAnchorNotFound(id: string) {
	if (docSections.value.some(section => section.id === id)) {
		selectSection(id);
	}
}

watch(() => activeSection.value.id, () => {
	document.querySelector(".docs-content")?.scrollTo({top: 0, behavior: "instant" as ScrollBehavior});
});
</script>

<style scoped lang="scss">
.docs-view {
	display: flex;
	width: 100%;
	flex: 1;
	min-height: 0;
	gap: 24px;
}

.docs-nav {
	width: 260px;
	flex-shrink: 0;
	height: 100%;
	overflow-y: auto;
}

.docs-content {
	flex: 1;
	min-width: 0;
	max-width: 820px;
	height: 100%;
	overflow-y: auto;
	padding-bottom: 60px !important;
}
</style>
