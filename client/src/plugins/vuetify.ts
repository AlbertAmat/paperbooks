/**
 * Vuetify setup: registers every component/directive and defines the app's
 * single custom light theme ("custom") plus the Material Design Icons set.
 */
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
                    background: '#f6f8fc',
                    primary: '#1c7ff1',
                    secondary: '#78dcf6',
                    accent: '#f5fb7b',
                    error: '#ff3535',
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
