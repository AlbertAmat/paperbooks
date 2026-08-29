<template>
	<v-menu
		v-model="model"
		location="end"
		:offset="15"
		:close-on-content-click="false"
	>
		<template v-slot:activator="{ props }">
			<v-list-item
				nav
				v-bind="props"
				:title="t(AppLabels.PRINT_QUEUE)"
				prepend-icon="mdi-printer-outline"
				density="compact"
				class="mx-2"
			>
				<template v-slot:prepend>
					<v-badge
						location="top right"
						color="primary"
						:content="printDialogController.getTotalLabels()"
					>
						<v-icon
							icon="mdi-printer-outline"
							:color="printDialogController.getTotalLabels() == 0 ? 'white' : 'primary'"
						/>
					</v-badge>
				</template>
			</v-list-item>
		</template>

		<v-card rounded width="400px">
			<v-card-title
				class="print-dialog-header py-2"
			>
				<span>{{t(AppLabels.PRINT_QUEUE)}}</span>

				<v-spacer/>

				<v-btn
					@click="model = false"
					variant="text"
					density="compact"
					icon
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>

			<v-card-text class="pt-3" style="font-size: 14px">
				{{t(AppLabels.TOTAL_LABELS_TO_PRINT)}} <b>{{controller.getTotalLabels()}}</b>
			</v-card-text>

			<v-divider/>

			<v-card-actions class="pr-4">
				<v-spacer/>
				<v-btn
					@click="controller.cancel()"
					variant="text"
					density="compact"
					color="red"
					class="mr-3 text-none"
				>
					{{t(AppLabels.CLEAR_QUEUE)}}
				</v-btn>

				<v-btn
					@click="controller.print()"
					color="primary"
					variant="elevated"
					density="compact"
					class="text-none"
				>
					{{t(AppLabels.PRINT)}}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-menu>
</template>

<script setup lang="ts">
/**
 * Print-queue menu shown from the app menu: displays how many barcode
 * labels are queued (added via `printDialogController.addLabel()` when a
 * book stock is created) and lets the user print them all as one PDF or
 * clear the queue. See PrintDialogController.ts.
 */
import {printDialogController} from "@/components/printDialog/PrintDialogController";
import {computed} from "vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

const controller = printDialogController;

const {t} = useI18n();

const model = computed({
	get() {
		return controller.isVisible();
	},
	set(value: boolean) {
		controller.setVisible(value);
	}
})

</script>

<style scoped lang="scss">
.print-dialog-header {
	display:flex;
	align-items: center;
	background-color: #011a38;
	color: white;
}
</style>