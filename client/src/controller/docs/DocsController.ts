import {BaseController} from "@/controller/BaseController";
import {i18n} from "@/plugins/i18n/i18n";
import {docsUiLabels, normalizeDocLocale} from "@/views/docs/docsData";

export default class DocsController extends BaseController<boolean> {

    public constructor() {
        super(docsUiLabels[normalizeDocLocale(i18n.global.locale.value)].pageTitle);
    }

    async fetchData(): Promise<boolean> {
        return true;
    }

    setData(data: boolean | null): void {
        // DO NOTHING
    }

    public getPageName(): string {
        return docsUiLabels[normalizeDocLocale(i18n.global.locale.value)].pageTitle;
    }

}
