<template>
	<v-dialog
		v-model="dialog"
		width="500"
	>
		<v-card>
			<v-card-title>
				{{ group ? t(AppLabels.EDIT_GROUP) : t(AppLabels.ADD_GROUP) }}
			</v-card-title>

			<v-divider></v-divider>

			<v-card-text>
				<v-alert
					v-if="applicationService.getUser().isPublicInstitution()"
					color="primary"
					variant="tonal"
					density="compact"
					icon="mdi-shield-alert-outline"
					style="font-size: 13px"
					class="mb-4"
				>
					{{ t(AppLabels.PUBLIC_INSTITUTION_SENSITIVE_DATA_WARNING) }}
				</v-alert>

				<v-text-field
					v-model="name"
					:label="t(AppLabels.NAME)"
					density="compact"
					variant="outlined"
					autofocus
					hide-details
					class="mb-4"
				></v-text-field>
				<v-textarea
					v-model="description"
					:label="t(AppLabels.DESCRIPTION)"
					density="compact"
					variant="outlined"
					rows="2"
					hide-details
				></v-textarea>
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
					@click="saveGroup()"
					class="text-none"
				>
					{{ group ? t(AppLabels.UPDATE) : t(AppLabels.ADD) }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
/**
 * Create/edit dialog for a customer group. Passing an existing `group`
 * prop switches it to edit mode; omitting it creates a new one.
 */
import {computed, Ref, ref} from 'vue'
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";
import CustomerGroup from "@/model/customer/CustomerGroup";
import CustomerGroupsController from "@/controller/customers/CustomerGroupsController";
import {applicationService} from "@/service/ApplicationService";

interface Props {
	group?: CustomerGroup,
	controller: CustomerGroupsController,
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
const name: Ref<string> = ref(props.group ? props.group.getName() : "");

/**
 *
 */
const description: Ref<string> = ref(props.group?.getDescription() ?? "");

/**
 *
 */
async function saveGroup() {
	try {
		loading.value = true;
		if (props.group) {
			await props.group.update(name.value, description.value.trim() || undefined);
		} else {
			await props.controller.addGroup(name.value, description.value.trim() || undefined);
		}
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
	description.value = "";
	dialog.value = false;
}
</script>
