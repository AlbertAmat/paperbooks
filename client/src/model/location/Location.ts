/** View model for a physical storage location, wrapping `ILocation` with reactive rename support. */
import ILocation from "@/types/location/ILocation";
import {locationsService} from "@/service/locations/LocationsService";
import {ref, Ref} from "vue";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

export default class Location {
    /** Location id, immutable once loaded. */
    protected readonly m_id: number;

    /** Location name. */
    private m_name: Ref<string>;

    /** Location description, or null if unset. */
    private m_description: Ref<string | null>;

    /** @param location Raw location data from the server. */
    public constructor(location: ILocation) {
        this.m_id = location.id;
        this.m_name = ref(location.name);
        this.m_description = ref(location.description);
    }

    /** @returns The location id. */
    public getId(): number {
        return this.m_id;
    }

    /** @returns The location name. */
    public getName(): string {
        return this.m_name.value;
    }

    /** @returns The location description, or null if unset. */
    public getDescription(): string | null {
        return this.m_description.value;
    }

    /**
     * Persist a new name/description on the server and update local state.
     * @param name New location name.
     * @param description New location description, or null to clear it.
     */
    public async update(name: string, description: string | null) {
        await locationsService.updateLocation(this.m_id, name, description)
        this.m_name.value = name;
        this.m_description.value = description;
        appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_LOCATION_UPDATED)})
    }
}
