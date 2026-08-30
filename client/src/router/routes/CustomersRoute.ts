import {ARoute} from "@/router/ARoute";

/** Route to the customers management view (`/app/customers`). */
export class CustomersRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/customers";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Customers";

    /** @returns The Vue Router route config for the customers view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: CustomersRoute.PATH,
            component: () => import('@/views/customers/CustomersView.vue'),
        }
    }

    /** @returns The navigable URL for the customers view. */
    public getPath() {
        return CustomersRoute.PATH;
    }
}

/** Singleton instance used throughout the app for navigation. */
export const customersRoute = new CustomersRoute();
