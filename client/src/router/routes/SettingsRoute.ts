import {ARoute} from "@/router/ARoute";

/** Route to the current user's account settings view (`/app/settings`). */
export class SettingsRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/settings";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Settings";

    /** @returns The Vue Router route config for the settings view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: SettingsRoute.PATH,
            component: () => import('@/views/settings/SettingsView.vue'),
        }
    }

    /** @returns The navigable URL for the settings view. */
    public getPath() {
        return SettingsRoute.PATH;
    }
}

/** Singleton instance used throughout the app for navigation. */
export const settingsRoute = new SettingsRoute();
