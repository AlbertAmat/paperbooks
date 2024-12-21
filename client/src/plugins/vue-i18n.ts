import Vue                                                 from "vue";
import VueI18n                                             from "vue-i18n";

Vue.use(VueI18n);

// Create VueI18n instance with options
const vueI18n = new VueI18n({
    locale: 'en',
    messages: {},
    silentTranslationWarn: true,
    formatFallbackMessages: false,
});

export default vueI18n;