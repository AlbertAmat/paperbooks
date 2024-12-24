import { Router } from "express";
import AppRoute from "./AppRoute";
import BooksRoute from "./BooksRoute";
import LocationRoute from "./LocationRoute";
import AuthorRoute from "./AuthorRoute";

export const routes: Record<string, Router> = {
    "/app": AppRoute,
    "/book": BooksRoute,
    "/location": LocationRoute,
    "/admin": AppRoute,
    "/author": AuthorRoute,
}