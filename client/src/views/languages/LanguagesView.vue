<template>
	<page-component :model="controller">
		<template v-slot:append>
			<v-btn
				@click="createLanguage()"
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
				:items="languages"
			>
				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="editLanguage(item.code)"
						small
						class="mx-1"
					>
						mdi-pencil
					</v-icon>
					<v-btn
						icon
						variant="text"
						density="compact"
						@click="deleteItem(item.code)"
						:loading="deleteLoading.includes(item.code)"
						:disabled="deleteLoading.includes(item.code)"
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

			<language-dialog
				v-if="dialog"
				v-model="dialog"
				:language="selectedLanguage"
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
import LanguagesController from "@/controller/languages/LanguagesController";
import Language from "@/model/language/Language";
import LanguageDialog from "@/views/languages/LanguageDialog.vue";

const controller = new LanguagesController();

/**
 *
 */
const dialog: Ref<boolean> = ref(false);

/**
 *
 */
const selectedLanguage: ShallowRef<Language | undefined> = shallowRef(undefined);

/**
 *
 */
const deleteLoading: Ref<string[]> = ref([]);

const headers = [
	{
		title: 'Code',
		value: 'code',
	},
	{
		title: 'Name',
		value: 'name',
	},
	{
		title: 'Actions',
		value: 'actions',
		align: 'end',
	},
];

/**
 *
 */
const languages = computed(() => {
	return controller.getLanguages().map(language => {
		return {
			code: language.getLanguageCode(),
			name: language.getLanguageName(),
		}
	})
})

/**
 *
 * @param code
 */
function editLanguage(code: string) {
	const language =  controller.getLanguages().find(language => language.getLanguageCode() === code);
	if(language) {
		selectedLanguage.value = language;
		dialog.value = true;
	}
}

/**
 *
 */
function createLanguage() {
	selectedLanguage.value = undefined;
	dialog.value = true;
}

/**
 *
 * @param code
 */
async function deleteItem(code: string) {
	const location = controller.getLanguage(code);
	confirmationDialogController.showDialog(
		`Delete language ${location ? location.getLanguageName() : ''}`,
		"Are you sure that you want to remove this language?",
		"Delete"
	).then(async () => {
		try {
			deleteLoading.value.push(code);
			await controller.deleteLanguage(code);
			applicationService.setLanguages(controller.getLanguages())
		} finally {
			deleteLoading.value.splice(deleteLoading.value.indexOf(code), 1);
		}
	});
}
</script>