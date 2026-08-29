/**
 * Backs the legal documents view (privacy policy, terms, cookie policy).
 * Has no server data to fetch (content lives statically in `legalData.ts`)
 * - only exists to set the page title via `BaseController`, localized
 * through `normalizeLegalLocale`.
 */
import {BaseController} from "@/controller/BaseController";
import {i18n} from "@/plugins/i18n/i18n";
import {legalUiLabels, normalizeLegalLocale} from "@/views/legal/legalData";

export default class LegalController extends BaseController<boolean> {

    public constructor() {
        super(legalUiLabels[normalizeLegalLocale(i18n.global.locale.value)].pageTitle);
    }

    async fetchData(): Promise<boolean> {
        return true;
    }

    setData(data: boolean | null): void {
        // DO NOTHING
    }

    public getPageName(): string {
        return legalUiLabels[normalizeLegalLocale(i18n.global.locale.value)].pageTitle;
    }

}
