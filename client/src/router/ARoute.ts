/**
 * Base class for every route definition under `router/routes/*`. Each
 * concrete subclass pairs a static `PATH` (the Vue Router path pattern,
 * e.g. "/book/:book_id") with a lazily-loaded view component, and exposes
 * `getPath(...)` so other code can build a navigable URL without hardcoding
 * path strings (e.g. `bookRoute.getPath(12)` -> "/book/12").
 *
 * @example
 * class FooRoute extends ARoute {
 *   public static PATH = "/foo";
 *   public getRoute() { return { name: "Foo", path: FooRoute.PATH, component: () => import("./FooView.vue") }; }
 *   public getPath() { return FooRoute.PATH; }
 * }
 */
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