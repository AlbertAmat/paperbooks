import {BaseController} from "@/controller/BaseController";
import {locationsService} from "@/service/locations/LocationsService";
import ILocation from "@/types/location/ILocation";

export default class LocationsController extends BaseController<ILocation[]> {

    public constructor() {
        super("Locations");
    }

    async fetchData(): Promise<ILocation[]> {
        return await locationsService.getLocations()
    }

    setData(data: ILocation[]) {

    }

}