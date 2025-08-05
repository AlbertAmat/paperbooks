import { Router } from "express";
import AppRoute from "./AppRoute";
import BooksRoute from "./BooksRoute";
import LocationRoute from "./LocationRoute";
import AuthorRoute from "./AuthorRoute";
import CategoriesRoute from "./CategoriesRoute";
import UserRoute from "./UserRoute";

export const routes: Record<string, Router> = {
    "/app": AppRoute,
    "/book": BooksRoute,
    "/location": LocationRoute,
    "/author": AuthorRoute,
    "/category": CategoriesRoute,
    "/user": UserRoute,
}