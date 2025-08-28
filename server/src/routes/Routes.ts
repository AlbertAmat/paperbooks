import { Router } from "express";
import AppRoute from "./AppRoute";
import BooksRoute from "./BooksRoute";
import LocationRoute from "./LocationRoute";
import AuthorRoute from "./AuthorRoute";
import CategoriesRoute from "./CategoriesRoute";
import UserRoute from "./UserRoute";
import DashboardRoute from "./DashboardRoute";
import CustomerRoute from "./CustomerRoute";

export const routes: Record<string, Router> = {
    "/app": AppRoute,
    "/dashboard": DashboardRoute,
    "/book": BooksRoute,
    "/location": LocationRoute,
    "/customer": CustomerRoute,
    "/author": AuthorRoute,
    "/category": CategoriesRoute,
    "/user": UserRoute,
}