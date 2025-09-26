<template>
	<page-component :model="controller">
		<template v-slot:append>
			<v-btn
				@click="createCategory()"
				class="text-none"
				color="primary"
				variant="elevated"
				small
			>
				{{t(AppLabels.ADD)}}
			</v-btn>
		</template>

		<template v-slot:default>
			<v-data-table-virtual
				:headers="headers"
				density="compact"
				:items="categories"
			>
				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="editCategory(item.id)"
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

			<category-dialog
				v-if="dialog"
				v-model="dialog"
				:category="selectedCategory"
				:controller="controller"
			/>
		</template>
	</page-component>
</template>

<script setup lang="ts">
import PageComponent from "@/views/PageComponent.vue";
import {computed, ref, Ref, ShallowRef, shallowRef} from "vue";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import {applicationService} from "@/service/ApplicationService";
import CategoriesController from "@/controller/categories/CategoriesController";
import Category from "@/model/category/Category";
import CategoryDialog from "./CategoryDialog.vue"
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

const controller = new CategoriesController();

const {t} = useI18n();

/**
 *
 */
const dialog: Ref<boolean> = ref(false);

/**
 *
 */
const selectedCategory: ShallowRef<Category | undefined> = shallowRef(undefined);

/**
 *
 */
const deleteLoading: Ref<number[]> = ref([]);

const headers = [
	{
		title: t(AppLabels.NAME),
		value: 'name',
	},
	{title: t(AppLabels.ACTIONS), value: 'actions', align: 'end',}
];

/**
 *
 */
const categories = computed(() => {
	return controller.getCategories().map(category => {
		return {
			id: category.getCategoryId(),
			name: category.getCategoryName(),
		}
	})
})

/**
 *
 * @param id
 */
function editCategory(id: number) {
	const category =  controller.getCategories().find(category => category.getCategoryId() === id);
	if(category) {
		selectedCategory.value = category;
		dialog.value = true;
	}
}

/**
 *
 */
function createCategory() {
	selectedCategory.value = undefined;
	dialog.value = true;
}

/**
 *
 * @param id
 */
async function deleteItem(id: number) {
	const category = controller.getCategory(id);
	confirmationDialogController.showDialog(
		`${t(AppLabels.DELETE_CATEGORY)} ${category ? category.getCategoryName() : ''}`,
		t(AppLabels.DELETE_CATEGORY_DESC),
		t(AppLabels.DELETE)
	).then(async () => {
		try {
			deleteLoading.value.push(id);
			await controller.deleteCategory(id);
			applicationService.setCategories(controller.getCategories())
		} finally {
			deleteLoading.value.splice(deleteLoading.value.indexOf(id), 1);
		}
	});
}
</script>