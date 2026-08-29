/** Lets Vite's `?raw` import suffix be used on Markdown files (imports the file's text content as a string), e.g. `import content from "./doc.md?raw"`. */
declare module '*.md?raw' {
  const content: string
  export default content
}
