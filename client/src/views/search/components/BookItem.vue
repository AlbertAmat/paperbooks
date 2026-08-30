<template>
	<v-hover v-slot="{ isHovering }">
		<v-card
			:to="book.getUrl()"
			:elevation="0"
			class="d-flex px-1 book-item pb-spine"
			:class="{'book-item--hover': isHovering}"
			height="125px"
			style="align-items: center"
		>
			<img
				:src="showFallback ? notFound : book.getImageUrl()"
				@error="showFallback = true"
				class="mr-2 my-0 book-item-cover"
			/>

			<div style="min-width: 0;">
				<!-- Book name -->
				<v-list-item-title
					:title="book.getName() "
					class="book-title pb-display ellipsis"
				>
					{{ book.getName() }}
				</v-list-item-title>

				<!-- Book author-->
				<v-list-item-subtitle
					v-if="book.hasAuthors()"
					:title="book.getAuthors()[0].getAuthorName()"
					class="book-subtitle ellipsis mt-1"
				>
					{{ book.getAuthors()[0].getAuthorName() }}
				</v-list-item-subtitle>

				<div class="mt-3" style="flex: 1">

					<!-- Book isbn -->
					<v-list-item-subtitle
						v-if="book.hasIsbn()"
						:title="book.getIsbn()"
						class="book-subtitle ellipsis"
					>
						<b>ISBN: </b> {{ book.getIsbn() }}
					</v-list-item-subtitle>

					<v-list-item-subtitle
						v-if="category"
						class="book-subtitle ellipsis"
					>
						<b>{{ t(AppLabels.CATEGORY) }}: </b> {{ category.getCategoryName() }}
					</v-list-item-subtitle>

					<v-list-item-subtitle
						v-if="language"
						class="book-subtitle ellipsis"
					>
						<b>{{ t(AppLabels.LANGUAGE) }}: </b> {{ language.getLanguageName() }}
					</v-list-item-subtitle>
				</div>
			</div>
		</v-card>
	</v-hover>
</template>

<script setup lang="ts">
/** One book card in the search results grid: cover, name, first author, ISBN, category, language. */
import {ref, Ref} from "vue";
import BookItem from "@/model/book/BookItem";

//@ts-ignore
import notFound from "@/assets/images/notFound.jpg";
import {applicationService} from "@/service/ApplicationService";
import {AppLabels} from "../../../plugins/i18n/AppLabels";
import {useI18n} from "vue-i18n";

interface Props {
	book: BookItem
}

const props = defineProps<Props>()

const {t} = useI18n();

/**
 *
 */
const showFallback: Ref<boolean> = ref(props.book.getImageUrl() === null);

const category = applicationService.getCategory(props.book.getCategoryId());
const language = applicationService.getLanguage(props.book.getLanguageCode());
</script>

<style scoped lang="scss">
.book-item {
	background: var(--pb-surface) !important;
	border: 1px solid var(--pb-border);
	border-radius: var(--pb-radius-sm) !important;
	transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.book-item--hover {
	transform: translateY(-2px);
	box-shadow: var(--pb-shadow);
	border-color: var(--pb-border-strong);
}

.book-item-cover {
	border-radius: 4px;
	height: 110px;
	width: 75px;
	object-fit: cover;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.book-title {
	line-height: normal;
	word-break: normal;
	font-weight: 600;
	display: block;
	font-size: 15px;
	flex: none !important;
	color: var(--pb-text);
}

.ellipsis {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	display: block;
}

.book-subtitle {
	padding: 0;
	font-size: 12px;
	color: var(--pb-text-muted);
}
</style>