import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: { customProperties: true }, // Enable CSS variables
    }
});
