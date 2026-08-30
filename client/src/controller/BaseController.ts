/**
 * Base class for every page-level "*Controller" backing a view (see
 * `controller/*` folder). Standardizes the load-a-page-of-data lifecycle:
 * sets `document.title`, fetches data on construction, and tracks
 * loading/error/data as Vue refs so the view can react to all three.
 *
 * Subclasses only need to implement `fetchData()` (call the relevant
 * `*Service`) and `setData()` (turn the raw response into model instances
 * stored on the subclass).
 *
 * @example
 * class FooController extends BaseController<IFoo> {
 *   constructor() { super("Foo"); }
 *   async fetchData() { return fooService.getData(); }
 *   setData(data: IFoo | null) { this.m_foo = data ? new Foo(data) : null; }
 * }
 */
import {ref, Ref, shallowRef, ShallowRef} from "vue";

export abstract class BaseController<I> {

    /** Whether the initial (or a re-triggered) `fetchData()` call is in flight. */
    private m_loading: Ref<boolean>;

    /** The error thrown by the last `fetchData()` call, or null if none. */
    private m_error: ShallowRef<any | null>;

    /** The raw data returned by the last successful `fetchData()` call, or null before that. */
    private m_data: ShallowRef<I | null>;

    /** Page title, also assigned to `document.title`. */
    private m_pageName: string;

    /** @param name Page title, used for `document.title` and returned by `getPageName()`. */
    protected constructor(name: string) {
        document.title = name;
        this.m_pageName = name;

        this.m_loading = ref(false);
        this.m_error = shallowRef(null);
        this.m_data = shallowRef(null);

        this.__fetchData();
    }

    /** Fetch this page's raw data from the backend. Implemented by each subclass. */
    abstract fetchData(): Promise<I>;

    /**
     * Turn fetched raw data into the subclass's model instance(s)/state.
     * @param data Raw data from `fetchData()`, or null.
     */
    abstract setData(data: I | null): void;

    /** @returns Whether a fetch is currently in flight. */
    public isLoading(): boolean {
        return this.m_loading.value;
    }

    /** @returns The page title. */
    public getPageName(): string {
        return this.m_pageName;
    }

    /** @returns Whether the last fetch failed. */
    public hasError(): boolean {
        return this.m_error.value != null;
    }

    /** @returns The error thrown by the last fetch, or null if none. */
    public getError(): any | null {
        return this.m_error.value;
    }

    /** @returns The raw data from the last successful fetch, or null before that. */
    public getData(): I | null {
        return this.m_data.value;
    }

    /** @returns Whether data has been successfully fetched at least once. */
    public hasData(): boolean {
        return this.m_data.value != null
    }

    /** Runs `fetchData()`/`setData()` while managing the loading/error state; called once on construction. */
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
