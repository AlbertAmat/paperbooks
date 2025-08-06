import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import {searchRoute} from "@/router/routes/SearchRoute";
import {DashboardRoute, dashboardRoute} from "@/router/routes/DashboardRoute";
import {bookRoute} from "@/router/routes/BookRoute";
import {notFoundRoute} from "@/router/routes/NotFoundRoute";
import {locationsRoute} from "@/router/routes/LocationsRoute";
import {categoriesRoute} from "@/router/routes/CategoriesRoute";
import {settingsRoute} from "@/router/routes/SettingsRoute";

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
    settingsRoute.getRoute(),

    // Not found
    notFoundRoute.getRoute(),
]

// Create the router instance
const router = createRouter({
    history: createWebHistory('/app'),
    routes,
})

export default router