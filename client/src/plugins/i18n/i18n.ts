/**
 * vue-i18n instance used for all UI text. Starts empty ("en": {}) - actual
 * translations are loaded at runtime from `GET /app/policy`'s `labels`
 * field and registered via `i18n.global.setLocaleMessage(...)`, see
 * `ApplicationService.fetchPolicy()`. Message keys are the `AppLabels` enum.
 */
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    legacy: false,
    globalInjection: true,
    messages: {
        en: {}
    }
});
