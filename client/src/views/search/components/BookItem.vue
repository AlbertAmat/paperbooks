<template>
	<v-hover v-slot="{ isHovering }">
		<v-card
			:to="book.getUrl()"
			:elevation="isHovering ? 2 : 0"
			class="d-flex px-1"
			height="125px"
			color="white"
			style="align-items: center; border: 1px solid #ECECEC"
		>
			<img
				:src="showFallback ? notFound : book.getImageUrl()"
				@error="showFallback = true"
				class="mr-2 my-0"
				style="border-radius: 6px; height: 110px; width: 75px; object-fit: cover"
			/>

			<div style="min-width: 0;">
				<!-- Book name -->
				<v-list-item-title
					:title="book.getName() "
					class="book-title ellipsis"
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
.book-title {
	line-height: normal;
	word-break: normal;
	font-weight: 530;
	display: block;
	font-size: 14px;
	flex: none !important;
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
}
</style>