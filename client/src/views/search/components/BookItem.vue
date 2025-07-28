<template>
	<v-hover v-slot="{ hover }">
		<router-link
			:to="book.getUrl()"
			style="text-decoration: none; height: 125px; position: relative"
		>
			<v-list-item
				style="border-radius: 8px; background-color: white;"
				two-line
				class="pa-3 app-border-2"
				:class="hover ? 'active' : ''"
			>
				<v-list-item-icon
					class="mr-1 my-0"
				>
					<img
						:src="showFallback ? notFound : book.getImageUrl()"
						@error="showFallback = true"
						style="border-radius: 6px; height: 110px; width: 75px; object-fit: cover"
					/>
				</v-list-item-icon>
				<v-list-item-content
					class="pt-0 pb-2 px-2"
					style="align-self: start; flex: 1"
				>
					<div style="width: 100%;">
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
							class="book-subtitle ellipsis"
						>
							<b>ISBN: </b> {{ book.getIsbn() }}
						</v-list-item-subtitle>
					</div>

					<v-chip
						v-if="category"
						x-small
						outlined
						color="primary"
						class="px-2 mb-1 mr-1 ellipsis"
						style="flex: none"
					>
						<v-icon small class="mr-2">mdi-shape-outline</v-icon>
						{{ category.getCategoryName() }}
					</v-chip>

					<v-chip
						v-if="language"
						x-small
						outlined
						color="green"
						class="px-2 mb-1 ellipsis"
						style="flex: none"
					>
						<v-icon small class="mr-2">mdi-flag-outline</v-icon>
						{{ language.getLanguageName() }}
					</v-chip>
				</v-list-item-content>
			</v-list-item>
		</router-link>
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