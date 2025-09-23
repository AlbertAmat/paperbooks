<template>
	<v-dialog
		v-model="dialog"
		width="500"
	>
		<v-card>
			<v-card-title>
				{{ location ? t(AppLabels.EDIT_LOCATION) : t(AppLabels.ADD_LOCATION) }}
			</v-card-title>

			<v-divider></v-divider>

			<v-card-text>
				<v-text-field
					v-model="name"
					:label="t(AppLabels.NAME)"
					density="compact"
					variant="outlined"
					hide-details
					class="mb-4"
				></v-text-field>

				<v-text-field
					v-model="description"
					:label="t(AppLabels.DESCRIPTION)"
					density="compact"
					variant="outlined"
					hide-details
				></v-text-field>
			</v-card-text>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					variant="text"
					@click="closeDialog()"
					class="text-none"
				>
					{{t(AppLabels.CLOSE)}}
				</v-btn>
				<v-btn
					color="primary"
					variant="elevated"
					:disabled="name === null || (name != null && name.trim().length === 0) || loading"
					:loading="loading"
					@click="addLocation()"
					class="text-none"
				>
					{{ location ? t(AppLabels.UPDATE) : t(AppLabels.ADD) }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import {computed, Ref, ref} from 'vue'
import LocationsController from "@/controller/locations/LocationsController";
import {applicationService} from "@/service/ApplicationService";
import LocationExt from "@/model/location/LocationExt";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

interface Props {
	location?: LocationExt,
	controller: LocationsController,
	modelValue: boolean
}

const props = defineProps<Props>();

const {t} = useI18n();

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
const name: Ref<string> = ref(props.location ? props.location.getName() : "");

/**
 *
 */
const description: Ref<string | null> = ref(props.location ? props.location.getDescription() : null);

/**
 *
 *
 */
async function addLocation() {
	try {
		loading.value = true;
		if (props.location) {
			await props.location.update(name.value, description.value)
		} else {
			await props.controller.addLocation(name.value, description.value)
		}
		applicationService.setLocations(props.controller.getLocations())
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
	description.value = null;
	dialog.value = false;
}
</script>