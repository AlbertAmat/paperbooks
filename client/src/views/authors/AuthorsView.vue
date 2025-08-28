<template>
	<page-component :model="controller">
		<template v-slot:append>
			<v-btn
				@click="createAuthor()"
				class="text-none gradient"
				color="primary"
				small
			>
				Add
			</v-btn>
		</template>

		<template v-slot:default>
			<v-data-table-virtual
				:headers="headers"
				density="compact"
				height="100%"
				:items="authors"
				fixed-header
			>
				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="editAuthor(item.id)"
						small
						class="mx-1"
					>
						mdi-pencil
					</v-icon>
					<v-btn
						icon
						variant="text"
						density="compact"
						@click="deleteItem(item.id)"
						:loading="deleteLoading.includes(item.id)"
						:disabled="deleteLoading.includes(item.id)"
						class="mx-1"
					>
						<v-icon
							small
							color="red"
						>
							mdi-delete
						</v-icon>
					</v-btn>
				</template>
			</v-data-table-virtual>

			<author-dialog
				v-if="dialog"
				v-model="dialog"
				:author="selectedAuthor"
				:controller="controller"
			/>
		</template>
	</page-component>
</template>

<script setup lang="ts">
import PageComponent from "@/views/PageComponent.vue";
import {computed, ref, Ref, ShallowRef, shallowRef} from "vue";
import AuthorDialog from "@/views/authors/AuthorDialog.vue";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import AuthorsController from "@/controller/authors/AuthorsController";
import BookAuthor from "@/model/author/BookAuthor";

const controller = new AuthorsController();

/**
 *
 */
const dialog: Ref<boolean> = ref(false);

/**
 *
 */
const selectedAuthor: ShallowRef<BookAuthor | undefined> = shallowRef(undefined);

/**
 *
 */
const deleteLoading: Ref<number[]> = ref([]);

const headers = [
	{
		title: 'Name',
		value: 'name',
	},
	{title: 'Actions', value: 'actions', align: 'end',}
];

/**
 *
 */
const authors = computed(() => {
	return controller.getAuthors().map(author => {
		return {
			id: author.getAuthorId(),
			name: author.getAuthorName(),
		}
	})
})

/**
 *
 * @param id
 */
function editAuthor(id: number) {
	const author =  controller.getAuthors().find(author => author.getAuthorId() === id);
	if(author) {
		selectedAuthor.value = author;
		dialog.value = true;
	}
}

/**
 *
 */
function createAuthor() {
	selectedAuthor.value = undefined;
	dialog.value = true;
}

/**
 *
 * @param authorId
 */
async function deleteItem(authorId: number) {
	const author = controller.getAuthor(authorId);
	confirmationDialogController.showDialog(
		`Delete author ${author ? author.getAuthorName() : ''}`,
		"Are you sure that you want to remove this author?",
		"Delete"
	).then(async () => {
		try {
			deleteLoading.value.push(authorId);
			await controller.deleteAuthor(authorId);
		} finally {
			deleteLoading.value.splice(deleteLoading.value.indexOf(authorId), 1);
		}
	});
}
</script>