// Import Vue instance
import Vue from "vue";

// Import application router
import router from "@/router/Router";

// Import Vuetify (Vue UI Library for Material Components).
import vuetify from "@/plugins/vuetify";

// Import i18n
import i18n from "@/plugins/vue-i18n";

// Import Vue application
import App from "./App.vue";

/**
 * Turn off the production tip you see in the console.
 */
Vue.config.productionTip = false;

/**
 * Create a new Vue instance and mount it inside #app (id of index.html root div)
 */
new Vue({
    vuetify,
    i18n,
    router,
    render: (h) => h(App)
}).$mount("#app"); // SEE: index.html -> <div id="app"></div>
