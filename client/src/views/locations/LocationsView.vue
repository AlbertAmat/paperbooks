<template>
	<page-component :model="controller">
		<template v-slot:append>
			<v-btn
				@click="createLocation()"
				class="text-none"
				color="primary"
				small
				variant="elevated"
			>
				{{t(AppLabels.ADD)}}
			</v-btn>
		</template>

		<template v-slot:default>
			<empty-state
				v-if="locations.length === 0"
				icon="mdi-map-marker-plus-outline"
				:chip-icons="['mdi-map-marker-outline', 'mdi-warehouse', 'mdi-bookshelf', 'mdi-office-building-outline', 'mdi-map-marker-radius-outline', 'mdi-book-outline', 'mdi-store-outline', 'mdi-map-outline']"
				:title="t(AppLabels.EMPTY_LOCATIONS_TITLE)"
				:description="t(AppLabels.EMPTY_LOCATIONS_DESC)"
			>
				<v-btn
					@click="createLocation()"
					class="text-none"
					color="primary"
					small
					variant="elevated"
				>
					{{t(AppLabels.ADD)}}
				</v-btn>
			</empty-state>

			<v-data-table-virtual
				v-else
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
							color="error"
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
/**
 * Locations management view: an expandable data table of all locations
 * (expanding a row shows its books via `LocationBooksTable`), with inline
 * edit/delete, an empty state when there are none, and the add/edit dialog.
 * Deletes also sync `ApplicationService`'s cached location list.
 */
import PageComponent from "@/views/PageComponent.vue";
import LocationsController from "@/controller/locations/LocationsController";
import {computed, ref, Ref, ShallowRef, shallowRef} from "vue";
import LocationDialog from "@/views/locations/LocationDialog.vue";
import {confirmationDialogController} from "@/components/confirmationDialog/ConfirmationDialogController";
import {applicationService} from "@/service/ApplicationService";
import LocationExt from "@/model/location/LocationExt";
import LocationBooksTable from "@/views/locations/LocationBooksTable.vue";
import EmptyState from "@/components/emptyState/EmptyState.vue";
import {useI18n} from "vue-i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

const controller = new LocationsController();

const {t} = useI18n();

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
		title: t(AppLabels.NAME),
		value: 'name',
	},
	{title: t(AppLabels.DESCRIPTION), value: 'description'},
	{title: t(AppLabels.TOTAL_BOOKS), value: 'totalBooks'},
	{title: t(AppLabels.ACTIONS), value: 'actions', align: 'end',}
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
		`${t(AppLabels.DELETE_LOCATION)} ${location ? location.getName() : ''}`,
		t(AppLabels.DELETE_LOCATION_DESC),
		t(AppLabels.DELETE)
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