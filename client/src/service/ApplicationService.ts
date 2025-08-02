import {ref, Ref} from "vue";
import axios from "axios";
import {PATH_PREFIX} from "@/Constants";
import IPolicyResponse from "@/types/IPolicyResponse";
import Language from "@/model/language/Language";
import Category from "@/model/category/Category";
import Location from "@/model/location/Location";
import Format from "@/model/format/Format";
import vuetify from "@/plugins/vuetify";
import axiosInstance from "@/plugins/axiosInstance";

export class ApplicationService {

    /**
     *
     * @private
     */
    private m_loading: Ref<boolean> = ref(true);

    /**
     *
     * @private
     */
    private m_menu: Ref<boolean> = ref(true);

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

    /**
     *
     * @private
     */
    private m_formats: Format[];

    /**
     *
     * @private
     */
    private m_locations: Location[];

    /**
     * The max size allowed for the database in MB
     * @private
     */
    private m_dbMaxSize: number;

    /**
     * The current size of the database in MB
     * @private
     */
    private m_dbSize: number;

    public constructor() {
        this.m_error = null;
        this.m_user = null;
        this.m_languages = [];
        this.m_locations = [];
        this.m_categories = [];
        this.m_formats = [];
        this.m_dbMaxSize = 0;
        this.m_dbSize = 0;
    }

    public async fetchPolicy() {
        try {
            this.m_loading.value = true;
            const response = await axiosInstance.get(`${PATH_PREFIX}/app/policy`);
            const data = response.data as IPolicyResponse;
            this.m_user = data.user;
            this.m_categories = data.categories.map((category) => new Category(category));
            this.m_languages = data.languages.map((lang) => new Language(lang));
            this.m_formats = data.formats.map((format) => new Format(format));
            this.m_locations = data.locations.map((location) => new Location(location));

            this.m_dbMaxSize = data.maxSize;
            this.m_dbSize = data.size;
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
    public getMenu(): boolean {
        return this.m_menu.value;
    }

    /**
     *
     */
    public setMenu(value: boolean) {
        this.m_menu.value = value;
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

    /**
     *
     */
    public hasFormats(): boolean {
        return this.m_formats.length > 0;
    }

    /**
     *
     * @param id
     */
    public getFormat(id: number): Format | undefined {
        return this.m_formats.find((format) => format.getFormatId() === id);
    }

    /**
     *
     */
    public getFormats(): Format[] {
        return this.m_formats;
    }

    /**
     *
     */
    public getLocations(): Location[] {
        return this.m_locations;
    }

    /**
     *
     */
    public getDatabaseMaxSize(): number {
        return this.m_dbMaxSize;
    }

    /**
     *
     */
    public getDatabaseSize(): number {
        return this.m_dbSize;
    }
}

export const applicationService = new ApplicationService();