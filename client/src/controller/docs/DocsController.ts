/**
 * Backs the in-app documentation view. Has no server data to fetch (`docs`
 * content lives statically in `docsData.ts`) - only exists to set the page
 * title via `BaseController`, localized through `normalizeDocLocale`.
 */
import {BaseController} from "@/controller/BaseController";
import {i18n} from "@/plugins/i18n/i18n";
import {docsUiLabels, normalizeDocLocale} from "@/views/docs/docsData";

export default class DocsController extends BaseController<boolean> {

    public constructor() {
        super(docsUiLabels[normalizeDocLocale(i18n.global.locale.value)].pageTitle);
    }

    /** @returns Always `true` - this controller has no server data to fetch. */
    async fetchData(): Promise<boolean> {
        return true;
    }

    /** @param data Unused - this controller has no state to populate. */
    setData(data: boolean | null): void {
        // DO NOTHING
    }

    /** @returns The localized documentation page title for the current locale. */
    public getPageName(): string {
        return docsUiLabels[normalizeDocLocale(i18n.global.locale.value)].pageTitle;
    }

}
