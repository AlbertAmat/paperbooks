import {PATH_PREFIX} from "@/Constants";
import {ISearchResponse} from "@/types/search/ISearchResponse";
import axiosInstance from "@/plugins/axiosInstance";
import ILocation from "@/types/location/ILocation";

class LocationsService {

    public async getLocations(): Promise<ILocation[]> {

        const {data} = await axiosInstance.get(`${PATH_PREFIX}/locations`)

        return data;
    }
}

export const locationsService = new LocationsService();