import {ARoute} from "@/router/ARoute";

/** Route to the categories management view (`/app/categories`). */
export class CategoriesRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/categories";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Categories";

    /** @returns The Vue Router route config for the categories view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: CategoriesRoute.PATH,
            component: () => import('@/views/categories/CategoriesView.vue'),
        }
    }

    /** @returns The navigable URL for the categories view. */
    public getPath() {
        return CategoriesRoute.PATH;
    }
}

/** Singleton instance used throughout the app for navigation. */
export const categoriesRoute = new CategoriesRoute();
