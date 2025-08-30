<template>
	<page-component :model="controller">
		<template v-slot:append>
			<v-btn
				@click="createLocation()"
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
				item-value="id"
				show-expand
				:items="locations"
			>
				<template v-slot:item.totalBooks="{ item }">
					<v-chip density="compact">{{ item.totalBooks }}</v-chip>
				</template>
				<template v-slot:item.actions="{ item }">
					<v-icon
						@click="editLocation(item.id)"
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
				<template v-slot:expanded-row="{ columns, item }">
					<tr>
						<td :colspan="columns.length" class="py-2">
							<v-sheet rounded="lg" border>
								<location-books-table :location="controller.getLocation(item.id)"/>
							</v-sheet>
						</td>
					</tr>
				</template>
			</v-data-table-virtual>

			<location-dialog
				v-if="dialog"
				v-model="dialog"
				:location="selectedLocation"
				:controller="controller"
			/>
		</template>
	</page-component>
</template>

<script setup lang="ts">
import PageComponent from "@/views/PageComponent.vue";
import LocationsController from "@/controller/locations/LocationsController";
import {computed, ref, Ref, ShallowRef, shallowRef} from "vue";
import LocationDialog from "@/views/locations/LocationDialog.vue";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import {applicationService} from "@/service/ApplicationService";
import LocationExt from "@/model/location/LocationExt";
import LocationBooksTable from "@/views/locations/LocationBooksTable.vue";

const controller = new LocationsController();

/**
 *
 */
const dialog: Ref<boolean> = ref(false);

/**
 *
 */
const selectedLocation: ShallowRef<LocationExt | undefined> = shallowRef(undefined);

/**
 *
 */
const deleteLoading: Ref<number[]> = ref([]);

const headers = [
	{
		title: 'Name',
		value: 'name',
	},
	{title: 'Description', value: 'description'},
	{title: 'Total books', value: 'totalBooks'},
	{title: 'Actions', value: 'actions', align: 'end',}
];

/**
 *
 */
const locations = computed(() => {
	return controller.getLocations().map(location => {
		return {
			id: location.getId(),
			name: location.getName(),
			description: location.getDescription(),
			totalBooks: location.getTotalBooks()
		}
	})
})

/**
 *
 * @param locationId
 */
function editLocation(locationId: number) {
	const location = controller.getLocations().find(location => location.getId() === locationId);
	if (location) {
		selectedLocation.value = location;
		dialog.value = true;
	}
}

/**
 *
 */
function createLocation() {
	selectedLocation.value = undefined;
	dialog.value = true;
}

/**
 *
 * @param locationId
 */
async function deleteItem(locationId: number) {
	const location = controller.getLocation(locationId);
	confirmationDialogController.showDialog(
		`Delete location ${location ? location.getName() : ''}`,
		"Are you sure that you want to remove this location?",
		"Delete"
	).then(async () => {
		try {
			deleteLoading.value.push(locationId);
			await controller.deleteLocation(locationId);
			applicationService.setLocations(controller.getLocations())
		} finally {
			deleteLoading.value.splice(deleteLoading.value.indexOf(locationId), 1);
		}
	});
}
</script>