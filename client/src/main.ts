import router from './router/Router'

// Icons
import '@mdi/font/css/materialdesignicons.css'
import {createApp} from "vue";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";

 createApp(App)
    .use(vuetify)
    .use(router)
    .mount('#app')
