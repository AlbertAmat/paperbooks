<template>
	<v-dialog
		v-model="model"
		width="500"
		persistent
	>
		<v-card>
			<v-card-title>
				{{ controller.getTitle() }}
			</v-card-title>

			<v-divider/>

			<v-card-text style="min-height: 60px; padding-top: 20px">
				{{ controller.getDescription() }}
			</v-card-text>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					variant="text"
					@click="cancel()"
					class="text-none"
					:loading="cancelLoading"
					:disabled="cancelLoading || acceptLoading"
				>
					{{t(AppLabels.CANCEL)}}
				</v-btn>
				<v-btn
					color="primary"
					density="comfortable"
					variant="elevated"
					@click="accept"
					:loading="acceptLoading"
					:disabled="acceptLoading || cancelLoading"
					class="text-none ml-1"
				>
					{{ controller.getAction() }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
/**
 * Single app-wide confirmation dialog, mounted once in App.vue. Renders
 * whatever title/description/action `confirmationDialogController.showDialog()`
 * was last called with, and resolves/rejects its pending promise on accept/cancel.
 */
import {computed, ref, Ref} from 'vue'
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController"
import {AppLabels} from "@/plugins/i18n/AppLabels";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const controller = confirmationDialogController;

const acceptLoading: Ref<boolean> = ref(false);
const cancelLoading: Ref<boolean> = ref(false);

const model = computed({
	get() {
		return controller.isVisible();
	},
	set(value: boolean) {
		controller.setVisible(value);
	}
})

async function accept() {
	try {
		acceptLoading.value = true;
		await controller.executeAction();
	} finally {
		acceptLoading.value = false;
	}
}

async function cancel() {
	try {
		cancelLoading.value = true;
		await controller.cancelAction();
	} finally {
		cancelLoading.value = false;
	}
}
</script>