import {ARoute} from "@/router/ARoute";

/** Route to the locations management view (`/app/locations`). */
export class LocationsRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/locations";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Locations";

    /** @returns The Vue Router route config for the locations view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: LocationsRoute.PATH,
            component: () => import('@/views/locations/LocationsView.vue'),
        }
    }

    /** @returns The navigable URL for the locations view. */
    public getPath() {
        return LocationsRoute.PATH;
    }
}

/** Singleton instance used throughout the app for navigation. */
export const locationsRoute = new LocationsRoute();
