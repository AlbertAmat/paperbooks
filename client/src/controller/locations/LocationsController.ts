import {BaseController} from "@/controller/BaseController";
import {locationsService} from "@/service/locations/LocationsService";
import {ShallowRef, shallowRef} from "vue";
import {appSnackbarController} from "@/components/appSnackbar/AppSnackbarController";
import ILocationExt from "@/types/location/ILocationExt";
import LocationExt from "@/model/location/LocationExt";

export default class LocationsController extends BaseController<ILocationExt[]> {

    /**
     *
     * @private
     */
    private m_locations: ShallowRef<LocationExt[]> = shallowRef([]);

    public constructor() {
        super("Locations");
    }

    async fetchData(): Promise<ILocationExt[]> {
        return await locationsService.getLocations()
    }

    setData(data: ILocationExt[]) {
        this.m_locations.value = data.map(location => new LocationExt(location));
    }

    /**
     *
     */
    public getLocations(): LocationExt[] {
        return this.m_locations.value;
    }

    /**
     *
     */
    public getLocation(id: number): LocationExt | undefined {
        return this.m_locations.value.find(location => location.getId() === id);
    }

    /**
     *
     * @param name
     * @param description
     */
    public async addLocation(name: string, description: string | null) {
        try {
            const location = await locationsService.addLocation(name, description);
            this.m_locations.value = [...this.m_locations.value, new LocationExt(location)];
            appSnackbarController.show({message: "Location has been added successfully"})
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @param locationId
     */
    public async deleteLocation(locationId: number) {
        const index = this.m_locations.value.findIndex(location => location.getId() === locationId);
        if(index != -1 ) {
            try {
                await locationsService.deleteLocation(locationId);
                this.m_locations.value.splice(index, 1);
                this.m_locations.value = [...this.m_locations.value];
                appSnackbarController.show({message: "Location has been deleted successfully"})
            } catch (e) {
                console.error(e);
            }
        }
    }
}