<template>
	<v-hover v-slot="{ isHovering }">
		<v-card
			:to="book.getUrl()"
			elevation="0"
			class="d-flex px-1"
			height="125px"
			:class="isHovering ? 'active' : ''"
			color="background"
			style=" align-items: center; border: 1px solid #ECECEC"
		>
			<img
				:src="showFallback ? notFound : book.getImageUrl()"
				@error="showFallback = true"
				class="mr-2 my-0"
				style="border-radius: 6px; height: 110px; width: 75px; object-fit: cover"
			/>

			<div>
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
					class="book-subtitle ellipsis"
				>
					{{ book.getAuthors()[0].getAuthorName() }}
				</v-list-item-subtitle>

				<!-- Book isbn -->
				<v-list-item-subtitle
					v-if="book.hasIsbn()"
					:title="book.getIsbn()"
					class="book-subtitle ellipsis mb-2"
				>
					<b>ISBN: </b> {{ book.getIsbn() }}
				</v-list-item-subtitle>

				<v-chip
					v-if="category"
					density="compact"
					variant="outlined"
					class="px-2 mb-1 mr-1 ellipsis"
					style="display: block; width: fit-content"
				>
					<v-icon small class="mr-2">mdi-shape-outline</v-icon>
					{{ category.getCategoryName() }}
				</v-chip>

				<v-chip
					v-if="language"
					density="compact"
					variant="outlined"
					color="green"
					class="px-2 mb-1 ellipsis"
					style="display: block; width: fit-content"
				>
					<v-icon small class="mr-2">mdi-flag-outline</v-icon>
					{{ language.getLanguageName() }}
				</v-chip>
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

interface Props {
	book: BookItem
}

const props = defineProps<Props>()

/**
 *
 */
const showFallback: Ref<boolean> = ref(false);

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
}

.book-subtitle {
	padding: 0;
	font-size: 12px;
}

.active {
	border: 2px solid var(--v-primary-base)
}
</style>