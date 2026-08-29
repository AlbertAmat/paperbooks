/** Lets TypeScript import `.vue` single-file components without type errors (Vue's own types don't cover raw `.vue` module resolution). */
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}