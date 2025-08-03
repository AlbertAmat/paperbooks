import ILanguage from "@/types/language/ILanguage";
import {ref, Ref} from "vue";
import {locationsService} from "@/service/locations/LocationsService";
import {languagesService} from "@/service/languages/LanguagesService";

export default class Language {
    /**
     *
     * @private
     */
    private readonly m_languageCode: Ref<string>;

    /**
     *
     * @private
     */
    private readonly m_languageName: Ref<string>;

    public constructor(data: ILanguage) {
        this.m_languageCode = ref(data.code);
        this.m_languageName = ref(data.name);
    }

    /**
     *
     */
    public getLanguageCode(): string {
        return this.m_languageCode.value;
    }

    /**
     * 
     */
    public getLanguageName(): string {
        return this.m_languageName.value;
    }

    public async update(name: string) {
        await languagesService.updateLanguage(this.m_languageCode.value, name)
        this.m_languageName.value = name;
    }
}