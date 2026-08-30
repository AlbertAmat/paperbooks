import {ARoute} from "@/router/ARoute";

/** Route to the loans management view (`/app/loans`). */
export class LoansRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/loans";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Loans";

    /** @returns The Vue Router route config for the loans view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: LoansRoute.PATH,
            component: () => import('@/views/loans/LoansView.vue'),
        }
    }

    /** @returns The navigable URL for the loans view. */
    public getPath() {
        return LoansRoute.PATH;
    }
}

/** Singleton instance used throughout the app for navigation. */
export const loansRoute = new LoansRoute();
