import { Router } from "express";
import AppRoute from "./AppRoute";
import BooksRoute from "./BooksRoute";
import LocationRoute from "./LocationRoute";
import AuthorRoute from "./AuthorRoute";
import LanguagesRoute from "./LanguagesRoute";

export const routes: Record<string, Router> = {
    "/app": AppRoute,
    "/book": BooksRoute,
    "/location": LocationRoute,
    "/author": AuthorRoute,
    "/language": LanguagesRoute,
}