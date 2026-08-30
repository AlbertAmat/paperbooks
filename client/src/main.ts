/**
 * Vue application entry point. Bootstraps the app with its three plugins -
 * i18n (translations), Vuetify (UI components/theme) and the Vue Router -
 * then mounts it onto `#app` in client/index.html.
 */
import router from './router/Router'
import '@mdi/font/css/materialdesignicons.css'
import "@/assets/styles/theme.scss";
import {createApp} from "vue";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import {i18n} from "@/plugins/i18n/i18n";

createApp(App)
    .use(i18n)
    .use(vuetify)
    .use(router)
    .mount('#app')
