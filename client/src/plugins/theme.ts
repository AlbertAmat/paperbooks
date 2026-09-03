/**
 * Applies one of the app's two themes ("beige" | "library") at runtime:
 * flips Vuetify's active theme and sets `data-theme` on <html> (which
 * drives the CSS custom properties in assets/styles/theme.scss for all
 * hand-written styling). Called once from App.vue after the logged-in
 * user's policy loads (using their saved `users.theme`), and again
 * immediately whenever they pick a different theme in Settings.
 */
import vuetify from "@/plugins/vuetify";

export type AppTheme = "beige" | "library";

export const DEFAULT_THEME: AppTheme = "beige";

export function isAppTheme(value: string | null | undefined): value is AppTheme {
    return value === "beige" || value === "library";
}

export function applyTheme(theme: string | null | undefined) {
    const resolved: AppTheme = isAppTheme(theme) ? theme : DEFAULT_THEME;

    document.documentElement.dataset.theme = resolved;
    //@ts-ignore - Vuetify's created instance exposes `theme` (ThemeInstance) though it's not in the public plugin type.
    vuetify.theme.change(resolved);
}
