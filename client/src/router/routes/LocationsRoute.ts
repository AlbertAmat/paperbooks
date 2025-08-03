import {ARoute} from "@/router/ARoute";

export class LocationsRoute extends ARoute {

    public static PATH = "/locations";

    private m_name: string = "Locations";

    public getRoute() {
        return  {
            name: this.m_name,
            path: LocationsRoute.PATH,
            component: () => import('@/views/locations/LocationsView.vue'),
        }
    }

    public getPath() {
        return LocationsRoute.PATH;
    }
}

export const locationsRoute = new LocationsRoute();