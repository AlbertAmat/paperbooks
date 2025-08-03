<template>
	<v-dialog
		v-model="dialog"
		width="500"
	>
		<v-card>
			<v-card-title>
				{{ language ? 'Edit language' : 'Add language' }}
			</v-card-title>

			<v-divider></v-divider>

			<v-card-text>
				<v-text-field
					v-model="code"
					label="Code"
					density="compact"
					variant="outlined"
					maxlength="2"
					hide-details
					:disabled="language != undefined"
					class="mb-4"
				></v-text-field>

				<v-text-field
					v-model="name"
					label="Name"
					density="compact"
					variant="outlined"
					hide-details
				></v-text-field>
			</v-card-text>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					text
					small
					@click="closeDialog()"
					class="text-none"
				>
					Close
				</v-btn>
				<v-btn
					color="primary"
					outlined
					small
					:disabled="code === null || (code != null && code.trim().length === 0) || (name != null && name.trim().length === 0) || loading"
					:loading="loading"
					@click="addLocation()"
					class="text-none"
				>
					{{ language ? 'Update' : 'Add' }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import {computed, Ref, ref} from 'vue'
import {applicationService} from "@/service/ApplicationService";
import Language from "@/model/language/Language";
import LanguagesController from "@/controller/languages/LanguagesController";

interface Props {
	language?: Language,
	controller: LanguagesController,
	modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

/**
 *
 */
const dialog = computed({
	get: () => props.modelValue,
	set: (val: boolean) => emit('update:modelValue', val),
})

/**
 *
 */
const loading: Ref<boolean> = ref(false);

/**
 *
 */
const code: Ref<string> = ref(props.language ? props.language.getLanguageCode() : "");

/**
 *
 */
const name: Ref<string> = ref(props.language ? props.language.getLanguageName() : "");

/**
 *
 *
 */
async function addLocation() {
	try {
		loading.value = true;
		if (props.language) {
			await props.language.update(name.value)
		} else {
			await props.controller.addLanguage(code.value, name.value)
		}
		applicationService.setLanguages(props.controller.getLanguages())
		closeDialog();
	} finally {
		loading.value = false;
	}
}

/**
 *
 */
function closeDialog() {
	name.value = "";
	code.value = "";
	dialog.value = false;
}
</script>