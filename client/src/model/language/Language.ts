import ILanguage from "@/types/language/ILanguage";
import {ref, Ref} from "vue";

/** View model for a language option. Read-only - languages are managed globally, not per-user. */
export default class Language {
    private readonly m_languageCode: string;
    private readonly m_languageName: string;

    public constructor(data: ILanguage) {
        this.m_languageCode = data.code;
        this.m_languageName = data.name;
    }

    public getLanguageCode(): string {
        return this.m_languageCode;
    }

    public getLanguageName(): string {
        return this.m_languageName;
    }
}
