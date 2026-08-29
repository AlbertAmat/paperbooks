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
