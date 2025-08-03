import {PATH_PREFIX} from "@/Constants";
import {ISearchResponse} from "@/types/search/ISearchResponse";
import axiosInstance from "@/plugins/axiosInstance";
import ILocation from "@/types/location/ILocation";

class LocationsService {

    public async getLocations(): Promise<ILocation[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/location`)
        return data;
    }

    public async updateLocation(id: number, name: string, description: string | null) {
        await axiosInstance.put(`${PATH_PREFIX}/location/${id}`, {
            name: name,
            description: description
        })
    }

    public async addLocation(name: string, description: string | null): Promise<ILocation> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/location`, {
            name: name,
            description: description
        })

        return data;
    }

    public async deleteLocation(locationId: number): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/location/${locationId}`)
    }
}

export const locationsService = new LocationsService();