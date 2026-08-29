import {ARoute} from "@/router/ARoute";

/** Route to the legal documents view (privacy policy, terms, cookie policy) (`/app/legal/:document?`). */
export class LegalRoute extends ARoute {

    public static PATH = "/legal/:document?";

    private m_name: string = "Legal";

    public getRoute() {
        return  {
            name: this.m_name,
            path: LegalRoute.PATH,
            component: () => import('@/views/legal/LegalView.vue'),
        }
    }

    /** @param document Optional document slug (see `legalData.ts`); omit for the legal index. */
    public getPath(document?: string) {
        return document ? `/legal/${document}` : "/legal";
    }
}

export const legalRoute = new LegalRoute();
