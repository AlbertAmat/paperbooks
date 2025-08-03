import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import {searchRoute} from "@/router/routes/SearchRoute";
import {OverviewRoute, overviewRoute} from "@/router/routes/OverviewRoute";
import {bookRoute} from "@/router/routes/BookRoute";
import {notFoundRoute} from "@/router/routes/NotFoundRoute";
import {locationsRoute} from "@/router/routes/LocationsRoute";

// Define your routes
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: OverviewRoute.PATH,
    },
    overviewRoute.getRoute(),
    searchRoute.getRoute(),
    bookRoute.getRoute(),
    locationsRoute.getRoute(),
    notFoundRoute.getRoute(),
]

// Create the router instance
const router = createRouter({
    history: createWebHistory('/app'),
    routes,
})

export default router