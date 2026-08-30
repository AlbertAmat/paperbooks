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
    /** Each route must define its own Vue Router path pattern. */
    public static PATH: string;

    /** @returns The Vue Router route config (name, path, lazy component) for this route. */
    public abstract getRoute(): RouteRecordRaw;

    /**
     * @param args Route-specific values to substitute into the path (e.g. an id), if any.
     * @returns A navigable URL string for this route.
     */
    public abstract getPath(...args: any[]): string;
}