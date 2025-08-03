import {BaseController} from "@/controller/BaseController";
import {ShallowRef, shallowRef} from "vue";
import ILanguage from "@/types/language/ILanguage";
import {languagesService} from "@/service/languages/LanguagesService";
import Language from "@/model/language/Language";

export default class LanguagesController extends BaseController<ILanguage[]> {

    /**
     *
     * @private
     */
    private m_languages: ShallowRef<Language[]> = shallowRef([]);

    public constructor() {
        super("Language");
    }

    async fetchData(): Promise<ILanguage[]> {
        return await languagesService.getLanguages()
    }

    setData(data: ILanguage[]) {
        this.m_languages.value = data.map(language => new Language(language));
    }

    /**
     *
     */
    public getLanguages(): Language[] {
        return this.m_languages.value;
    }

    /**
     *
     */
    public getLanguage(code: string): Language | undefined {
        return this.m_languages.value.find(language => language.getLanguageCode() === code);
    }

    /**
     *
     * @param name
     * @param description
     */
    public async addLanguage(code: string, name: string ) {
        try {
             await languagesService.addLanguage(code, name);
            this.m_languages.value = [...this.m_languages.value, new Language({code: code, name: name})];
        } catch (e) {
            console.error(e);
        }
    }

    /**
     *
     * @param locationId
     */
    public async deleteLanguage(code: string) {
        const index = this.m_languages.value.findIndex(language => language.getLanguageCode() === code);
        if(index != -1 ) {
            try {
                await languagesService.deleteLanguage(code);
                this.m_languages.value.splice(index, 1);
                this.m_languages.value = [...this.m_languages.value];
            } catch (e) {
                console.error(e);
            }
        }
    }
}