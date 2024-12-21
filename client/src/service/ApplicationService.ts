import {ref, Ref} from "vue";
import App from "@/App.vue";
import axios from "axios";
import {PATH_PREFIX} from "@/Constants";
import IPolicyResponse from "@/types/IPolicyResponse";
import Language from "@/model/language/Language";
import Category from "@/model/category/Category";

export class ApplicationService {

    /**
     *
     * @private
     */
    private m_loading: Ref<boolean> = ref(true  );

    /**
     *
     * @private
     */
    private m_error: Error | null;

    /**
     *
     * @private
     */
    private m_user: Record<string, any> | null;

    /**
     *
     * @private
     */
    private m_languages: Language[];

     /**
     *
     * @private
     */
    private m_categories: Category[];

    public constructor() {
        this.m_error = null;
        this.m_user = null;
        this.m_languages = [];
        this.m_categories = [];
    }

    public async fetchPolicy() {
        try {
            this.m_loading.value = true;
            const response = await axios.get(`${PATH_PREFIX}/app/policy`);
            const data = response.data as IPolicyResponse;
            this.m_user = data.user;
            this.m_categories = data.categories.map((category) => new Category(category));
            this.m_languages = data.languages.map((lang) => new Language(lang));
        } catch (e: any) {
            const error = e as Error;
            console.error("Error while fetching application policy.", e);
            this.m_error = error;
        }  finally {
            this.m_loading.value = false;
        }
    }

    /**
     *
     */
    public isLoading(): boolean {
        return this.m_loading.value;
    }

    /**
     *
     */
    public hasError(): boolean {
        return this.m_error != null;
    }

    /**
     *
     */
    public getError(): Error | null {
        return this.m_error;
    }

    /**
     *
     */
    public getUser(): Record<string, any> | null {
        return this.m_user;
    }

    /**
     *
     */
    public getCategories(): Category[] {
        return this.m_categories;
    }

    /**
     *
     * @param id
     */
    public getCategory(id: number | null): Category | undefined {
        if(!id) {
            return undefined;
        }
        return this.m_categories.find((category) => category.getCategoryId() === id);
    }

    /**
     *
     */
    public getLanguages(): Language[] {
        return this.m_languages;
    }

    /**
     *
     * @param id
     * @param id
     */
    public getLanguage(code: string | null): Language | undefined {
        if(!code) {
            return undefined;
        }
        return this.m_languages.find((language) => language.getLanguageCode() === code);
    }
}

export const applicationService = new ApplicationService();