<template>
	<div class="pb-file-preview">
		<div v-if="loading" class="pb-file-preview-state pb-file-preview-overlay">
			<v-progress-circular color="primary" indeterminate size="32"/>
		</div>

		<div v-else-if="error" class="pb-file-preview-state pb-file-preview-overlay">
			<v-icon size="28" color="error" class="mb-1">mdi-alert-circle-outline</v-icon>
			<span class="text-caption" style="color: var(--pb-text-muted)">{{ t(AppLabels.PREVIEW_UNAVAILABLE) }}</span>
		</div>

		<iframe
			v-if="fileType === 'pdf' && objectUrl"
			:src="objectUrl"
			class="pb-file-preview-pdf"
			title="PDF preview"
		></iframe>

		<!--
			The epub container stays visible (not gated by `loading`/`v-show`)
			the whole time, even while the loading/error overlay covers it -
			epubjs measures this element's real layout box to size its iframe,
			and a `display:none` element (what `v-show` would produce here)
			always measures 0, breaking that.
		-->
		<template v-if="fileType === 'epub'">
			<div ref="epubContainer" class="pb-file-preview-epub-viewport"></div>
			<div class="pb-file-preview-epub-nav">
				<v-btn icon variant="text" density="comfortable" @click="rendition?.prev()">
					<v-icon>mdi-chevron-left</v-icon>
				</v-btn>
				<v-btn icon variant="text" density="comfortable" @click="rendition?.next()">
					<v-icon>mdi-chevron-right</v-icon>
				</v-btn>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
/**
 * In-page preview of a book's backed-up epub/pdf file, shown on the book
 * detail view for `Electronic`-format books: PDF renders in the browser's
 * native viewer (an iframe over a blob URL); EPUB renders via `epubjs`
 * into a scoped container with prev/next page controls. Both fetch the
 * file's bytes through `BookService.downloadFileBlob` (not the `/download`
 * link, which forces a save-as instead of inline rendering).
 */
import {nextTick, onMounted, onUnmounted, ref, Ref, shallowRef, ShallowRef} from "vue";
import ePub, {Rendition} from "epubjs";
import Book from "@/model/book/Book";
import {bookService} from "@/service/book/BookService";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

const {t} = useI18n();

interface Props {
	book: Book;
}

const props = defineProps<Props>();

const loading: Ref<boolean> = ref(true);
const error: Ref<boolean> = ref(false);
const objectUrl: Ref<string | null> = ref(null);
const epubContainer = ref<HTMLDivElement | null>(null);
const rendition: ShallowRef<Rendition | null> = shallowRef(null);

const fileType = props.book.getFile()?.file_type ?? null;

onMounted(async () => {
	try {
		const blob = await bookService.downloadFileBlob(props.book.getId());

		if (fileType === "pdf") {
			objectUrl.value = URL.createObjectURL(blob);
		} else if (fileType === "epub") {
			// The container div is rendered as soon as this component mounts,
			// but Vue may not have flushed it to the DOM yet - wait a tick so
			// `renderTo` gets a real, laid-out element (epubjs measures it
			// immediately to size its iframe).
			await nextTick();

			const buffer = await blob.arrayBuffer();
			const epubBook = ePub(buffer);
			rendition.value = epubBook.renderTo(epubContainer.value!, {
				width: "100%",
				height: "100%",
				spread: "none",
			});
			await rendition.value.display();
		}
	} catch (e) {
		console.error("Error while loading book file preview.", e);
		error.value = true;
	} finally {
		loading.value = false;
	}
});

onUnmounted(() => {
	if (objectUrl.value) {
		URL.revokeObjectURL(objectUrl.value);
	}
	rendition.value?.destroy();
});
</script>

<style scoped>
.pb-file-preview {
	border: 1px solid var(--pb-border);
	border-radius: var(--pb-radius-sm);
	overflow: hidden;
	background: var(--pb-surface-alt);
	height: 520px;
	position: relative;
}

.pb-file-preview-state {
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.pb-file-preview-overlay {
	position: absolute;
	inset: 0;
	background: var(--pb-surface-alt);
	z-index: 1;
}

.pb-file-preview-pdf {
	width: 100%;
	height: 100%;
	border: none;
}

.pb-file-preview-epub-viewport {
	width: 100%;
	height: calc(100% - 40px);
}

.pb-file-preview-epub-nav {
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-top: 1px solid var(--pb-border);
	background: var(--pb-surface);
}
</style>
