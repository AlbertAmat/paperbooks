import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import ILocationExt from "@/types/location/ILocationExt";
import ILocationBook from "@/types/location/ILocationBook";

class LocationsService {

    public async getLocations(): Promise<ILocationExt[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/location`)
        return data;
    }

    public async getLocationBooks(id: number): Promise<ILocationBook[]> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/location/${id}/books`)
        return data;
    }

    public async updateLocation(id: number, name: string, description: string | null) {
        await axiosInstance.put(`${PATH_PREFIX}/location/${id}`, {
            name: name,
            description: description
        })
    }

    public async addLocation(name: string, description: string | null): Promise<ILocationExt> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/location`, {
            name: name,
            description: description
        })

        return data;
    }

    public async deleteLocation(locationId: number): Promise<void> {
        await axiosInstance.delete(`${PATH_PREFIX}/location/${locationId}`)
    }

    /**
     *
     * @param locationId
     * @param books: array of book stock code
     */
    public async addBooks(locationId: number, books: string[]): Promise<ILocationBook[]> {
        const {data} = await axiosInstance.post(`${PATH_PREFIX}/location/${locationId}/add/books`, {books: books});
        return data;
    }
}

export const locationsService = new LocationsService();