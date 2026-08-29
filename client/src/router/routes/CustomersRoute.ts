import {ARoute} from "@/router/ARoute";

/** Route to the customers management view (`/app/customers`). */
export class CustomersRoute extends ARoute {

    public static PATH = "/customers";

    private m_name: string = "Customers";

    public getRoute() {
        return  {
            name: this.m_name,
            path: CustomersRoute.PATH,
            component: () => import('@/views/customers/CustomersView.vue'),
        }
    }

    public getPath() {
        return CustomersRoute.PATH;
    }
}

export const customersRoute = new CustomersRoute();