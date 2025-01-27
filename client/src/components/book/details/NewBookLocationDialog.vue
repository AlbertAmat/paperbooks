<template>
	<v-dialog
		v-model="dialog"
		width="500"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				small
				color="primary"
				class="text-none"
				v-bind="attrs"
				v-on="on"
			>
				Add
			</v-btn>
		</template>

		<v-card>
			<v-card-title class="d-flex align-center">
				Add book to a location

				<v-spacer></v-spacer>

				<v-btn
					@click="dialog = false"
					icon
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-divider></v-divider>

			<v-card-text>
				<p class="mt-2">
					Use this menu to assign a book to a specific location and set the quantity available.
				</p>

				<v-select
					label="Location"
					v-model="location"
					:items="locationsJSON"
				></v-select>

				<v-text-field
					v-model="quantity"
					label="Quantity"
					outlined
					dense
					hide-details
					type="number"
				></v-text-field>
			</v-card-text>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="primary"
					text
					@click="dialog = false"
				>
					I accept
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from 'vue'
import {applicationService} from "@/service/ApplicationService";

export default defineComponent({
	name: "NewBookLocationDialog",
	setup() {

		/**
		 *
		 */
		const dialog: Ref<boolean> = ref(false);

		/**
		 *
		 */
		const location: Ref<number | null> = ref(null);

		/**
		 *
		 */
		const quantity: Ref<number> = ref(0);

		const locationJSON = computed(() =>  {
			return applicationService.getL()
		})

		return {
			dialog,
			location,
			quantity
		}
	}
})
</script>

<style scoped lang="scss">

</style>