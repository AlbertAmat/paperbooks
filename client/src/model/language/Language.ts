import ILanguage from "@/types/language/ILanguage";
import {ref, Ref} from "vue";

export default class Language {
    /**
     *
     * @private
     */
    private readonly m_languageCode: string;

    /**
     *
     * @private
     */
    private readonly m_languageName: string;

    public constructor(data: ILanguage) {
        this.m_languageCode = data.code;
        this.m_languageName = data.name;
    }

    /**
     *
     */
    public getLanguageCode(): string {
        return this.m_languageCode;
    }

    /**
     * 
     */
    public getLanguageName(): string {
        return this.m_languageName;
    }
}