/**
 * Vue Router instance for the SPA, mounted under the `/app` base path
 * (matches the server-side catch-all in server/src/routes/AuthRoute.ts that
 * serves index.html for any `/app/*` request, enabling deep-linking/refresh).
 * Each entry delegates to a `router/routes/*Route.ts` singleton's `getRoute()`.
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import {searchRoute} from "@/router/routes/SearchRoute";
import {DashboardRoute, dashboardRoute} from "@/router/routes/DashboardRoute";
import {bookRoute} from "@/router/routes/BookRoute";
import {notFoundRoute} from "@/router/routes/NotFoundRoute";
import {locationsRoute} from "@/router/routes/LocationsRoute";
import {categoriesRoute} from "@/router/routes/CategoriesRoute";
import {settingsRoute} from "@/router/routes/SettingsRoute";
import {customersRoute} from "@/router/routes/CustomersRoute";
import {authorsRoute} from "@/router/routes/AuthorsRoute";
import {docsRoute} from "@/router/routes/DocsRoute";
import {legalRoute} from "@/router/routes/LegalRoute";

// Define your routes
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: DashboardRoute.PATH,
    },
    dashboardRoute.getRoute(),
    searchRoute.getRoute(),
    bookRoute.getRoute(),
    locationsRoute.getRoute(),
    categoriesRoute.getRoute(),
    customersRoute.getRoute(),
    authorsRoute.getRoute(),
    settingsRoute.getRoute(),
    docsRoute.getRoute(),
    legalRoute.getRoute(),

    // Not found
    notFoundRoute.getRoute(),
]

// Create the router instance
const router = createRouter({
    history: createWebHistory('/app'),
    routes,
})

export default router