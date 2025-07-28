// src/router/index.ts or router.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export enum RoutePaths {
    OVERVIEW = '/overview',
    SEARCH_BOOKS = '/books/search',
    BOOK = '/book/:book_id',
    NOT_FOUND = '/:pathMatch(.*)*', // Vue Router 4 wildcard syntax
}

// Define your routes
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: RoutePaths.OVERVIEW,
    },
    {
        name: 'Overview',
        path: RoutePaths.OVERVIEW,
        component: () => import('@/views/overview/OverviewView.vue'),
    },
    {
        name: 'Books',
        path: RoutePaths.SEARCH_BOOKS,
        component: () => import('@/views/search/BooksSearchView.vue'),
    },
    {
        name: 'Book',
        path: RoutePaths.BOOK,
        component: () => import('@/views/book/BookView.vue'),
    },
    {
        name: 'Not found',
        path: RoutePaths.NOT_FOUND,
        component: () => import('@/views/notFound/NotFoundView.vue'),
    },
]

// Create the router instance
const router = createRouter({
    history: createWebHistory('/app'), // 👈 replaces mode + base
    routes,
})

export default router