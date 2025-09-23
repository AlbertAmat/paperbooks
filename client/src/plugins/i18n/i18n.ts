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