import {ARoute} from "@/router/ARoute";

/** Route to the legal documents view (privacy policy, terms, cookie policy) (`/app/legal/:document?`). */
export class LegalRoute extends ARoute {

    /** Vue Router path pattern for this route. */
    public static PATH = "/legal/:document?";

    /** Route name shown in Vue Router config. */
    private m_name: string = "Legal";

    /** @returns The Vue Router route config for the legal view. */
    public getRoute() {
        return  {
            name: this.m_name,
            path: LegalRoute.PATH,
            component: () => import('@/views/legal/LegalView.vue'),
        }
    }

    /**
     * @param document Optional document slug (see `legalData.ts`); omit for the legal index.
     * @returns The navigable URL for the legal view (optionally scoped to a document).
     */
    public getPath(document?: string) {
        return document ? `/legal/${document}` : "/legal";
    }
}

/** Singleton instance used throughout the app for navigation. */
export const legalRoute = new LegalRoute();
