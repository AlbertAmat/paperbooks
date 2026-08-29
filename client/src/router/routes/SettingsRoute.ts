import {ARoute} from "@/router/ARoute";

/** Route to the current user's account settings view (`/app/settings`). */
export class SettingsRoute extends ARoute {

    public static PATH = "/settings";

    private m_name: string = "Settings";

    public getRoute() {
        return  {
            name: this.m_name,
            path: SettingsRoute.PATH,
            component: () => import('@/views/settings/SettingsView.vue'),
        }
    }

    public getPath() {
        return SettingsRoute.PATH;
    }
}

export const settingsRoute = new SettingsRoute();