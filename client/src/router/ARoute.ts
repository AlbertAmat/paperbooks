import {RouteRecordRaw} from "vue-router";

export abstract class ARoute {
    /**
     * Each route must define its own path.
     */
    public static PATH: string;

    /**
     * Each route must implement getRoute to return Vue Router config.
     */
    public abstract getRoute(): RouteRecordRaw;

    /**
     * Each route must implement getPath to return a navigable URL string.
     */
    public abstract getPath(...args: any[]): string;
}