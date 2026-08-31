/**
 * Shared open/closed state for the nav drawer (`AppMenu.vue`), toggled by the
 * hamburger button in `AppBar.vue` on phone-sized screens. A plain module-level
 * ref (same singleton pattern as `activeSearchController`) since the two
 * components are siblings under `App.vue` with no natural prop path between them.
 */
import {ref} from "vue";

export const navDrawerOpen = ref(false);
