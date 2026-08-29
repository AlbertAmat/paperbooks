/** View model for a physical storage location, wrapping `ILocation` with reactive rename support. */
import ILocation from "@/types/location/ILocation";
import {locationsService} from "@/service/locations/LocationsService";
import {ref, Ref} from "vue";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";
import {i18n} from "@/plugins/i18n/i18n";
import {AppLabels} from "@/plugins/i18n/AppLabels";

export default class Location {
    protected readonly m_id: number;
    private m_name: Ref<string>;
    private m_description: Ref<string | null>;

    public constructor(location: ILocation) {
        this.m_id = location.id;
        this.m_name = ref(location.name);
        this.m_description = ref(location.description);
    }

    public getId(): number {
        return this.m_id;
    }

    public getName(): string {
        return this.m_name.value;
    }

    public getDescription(): string | null {
        return this.m_description.value;
    }

    /** Persist a new name/description on the server and update local state. */
    public async update(name: string, description: string | null) {
        await locationsService.updateLocation(this.m_id, name, description)
        this.m_name.value = name;
        this.m_description.value = description;
        appSnackbarController.show({message: i18n.global.t(AppLabels.SNACKBAR_LOCATION_UPDATED)})
    }
}