<template>
	<v-dialog
		v-model="model"
		width="500"
		persistent
	>
		<v-card>
			<v-card-title>
				{{controller.getTitle()}}
			</v-card-title>

			<v-divider/>

			<v-card-text style="min-height: 60px; padding-top: 10px">
				{{controller.getDescription()}}
			</v-card-text>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					text
					@click="cancel()"
					class="text-none"
					:loading="cancelLoading"
					:disabled="cancelLoading || acceptLoading"
				>
					Cancel
				</v-btn>
				<v-btn
					color="primary"
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

<script lang="ts">
import {computed, defineComponent, ref, Ref} from 'vue'
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";

export default defineComponent({
	name: "ConfirmationDialog",
	setup() {
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

		return {
			controller,
			model,
			accept,
			cancel,
			acceptLoading,
			cancelLoading
		}
	}
})
</script>

<style scoped lang="scss">

</style>