import 'vuetify/styles'
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import {createVuetify} from "vuetify/framework";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {mdi},
    },
})