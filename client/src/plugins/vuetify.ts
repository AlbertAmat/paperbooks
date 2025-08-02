import 'vuetify/styles'
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import {createVuetify} from "vuetify/framework";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'custom',
        themes: {
            custom: {
                dark: false,
                colors: {
                    background: '#F8F8F8',
                    primary: '#a1f682',
                    secondary: '#787878',
                    accent: '#f5fb7b'
                }
            },
        },
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {mdi},
    },
})