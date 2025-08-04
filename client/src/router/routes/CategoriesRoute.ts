import {ARoute} from "@/router/ARoute";

export class CategoriesRoute extends ARoute {

    public static PATH = "/categories";

    private m_name: string = "Categories";

    public getRoute() {
        return  {
            name: this.m_name,
            path: CategoriesRoute.PATH,
            component: () => import('@/views/categories/CategoriesView.vue'),
        }
    }

    public getPath() {
        return CategoriesRoute.PATH;
    }
}

export const categoriesRoute = new CategoriesRoute();