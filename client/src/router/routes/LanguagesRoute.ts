import {ARoute} from "@/router/ARoute";

export class LanguagesRoute extends ARoute {

    public static PATH = "/languages";

    private m_name: string = "Languages";

    public getRoute() {
        return  {
            name: this.m_name,
            path: LanguagesRoute.PATH,
            component: () => import('@/views/languages/LanguagesView.vue'),
        }
    }

    public getPath() {
        return LanguagesRoute.PATH;
    }
}

export const languagesRoute = new LanguagesRoute();