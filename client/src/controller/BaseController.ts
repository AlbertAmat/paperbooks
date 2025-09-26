import {ref, Ref, shallowRef, ShallowRef} from "vue";

export abstract class BaseController<I> {

    /**
     *
     * @private
     */
    private m_loading: Ref<boolean>;

    /**
     *
     * @private
     */
    private m_error: ShallowRef<any | null>;

    /**
     *
     * @private
     */
    private m_data: ShallowRef<I | null>;

    private m_pageName: string;

    protected constructor(name: string) {
        document.title = name;
        this.m_pageName = name;

        this.m_loading = ref(false);
        this.m_error = shallowRef(null);
        this.m_data = shallowRef(null);

        this.__fetchData();
    }

    /**
     *
     */
    abstract fetchData(): Promise<I>;

    /**
     *
     * @param data
     * @protected
     */
    abstract setData(data: I | null): void;

    /**
     *
     */
    public isLoading(): boolean {
        return this.m_loading.value;
    }

    public getPageName(): string {
        return this.m_pageName;
    }

    /**
     *
     */
    public hasError(): boolean {
        return this.m_error.value != null;
    }

    /**
     *
     */
    public getError(): any | null {
        return this.m_error.value;
    }

    /**
     *
     */
    public getData(): I | null {
        return this.m_data.value;
    }

    public hasData(): boolean {
        return this.m_data.value != null
    }

    protected async __fetchData() {
        try {
            this.m_loading.value = false;
            this.m_error.value = null;

            const data = await this.fetchData();
            this.m_data.value = data;
            this.setData(data);
        } catch (e ) {
            this.m_error.value = e;
            console.error("Error while fetching data. ", e)
        } finally {
            this.m_loading.value = false;
        }
    }
}