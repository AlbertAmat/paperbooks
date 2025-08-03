import {BaseController} from "@/controller/BaseController";
import {locationsService} from "@/service/locations/LocationsService";
import ILocation from "@/types/location/ILocation";
import {ShallowRef, shallowRef} from "vue";
import Location from "@/model/location/Location"

export default class LocationsController extends BaseController<ILocation[]> {

    /**
     *
     * @private
     */
    private m_locations: ShallowRef<Location[]> = shallowRef([]);

    public constructor() {
        super("Locations");
    }

    async fetchData(): Promise<ILocation[]> {
        return await locationsService.getLocations()
    }

    setData(data: ILocation[]) {
        this.m_locations.value = data.map(location => new Location(location));
    }

    /**
     *
     */
    public getLocations(): Location[] {
        return this.m_locations.value;
    }

    /**
     *
     */
    public getLocation(id: number): Location | undefined {
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
            this.m_locations.value = [...this.m_locations.value, new Location(location)];
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
            } catch (e) {
                console.error(e);
            }
        }
    }
}