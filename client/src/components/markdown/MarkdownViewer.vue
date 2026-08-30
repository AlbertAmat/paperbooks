<template>
	<div ref="root" class="markdown-viewer" v-html="renderedHtml" @click="onClick"></div>
</template>

<script setup lang="ts">
/**
 * Renders a Markdown string as sanitized HTML (used by the in-app docs
 * view). Adds two behaviors on top of plain `marked` rendering:
 *  - every heading gets a slugified `id` (or an explicit `{#id}` suffix),
 *    so other content can deep-link to a section;
 *  - in-page `#anchor` links smooth-scroll to that heading instead of
 *    reloading, emitting `anchor-not-found` if the target doesn't exist
 *    (e.g. a stale link into a doc section that was edited).
 * Output is run through DOMPurify since the Markdown source could
 * contain raw HTML.
 */
import {computed, ref} from "vue";
import {marked, Tokens} from "marked";
import DOMPurify from "dompurify";

interface Props {
	source: string;
}

interface Emits {
	(e: "anchor-not-found", id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const root = ref<HTMLElement | null>(null);

/** Turn heading text into a URL-safe, lowercase, hyphenated anchor id (strips accents/HTML). */
function slugify(text: string): string {
	return text
		.replace(/<[^>]+>/g, "")
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-");
}

marked.use({
	renderer: {
		heading({tokens, depth}: Tokens.Heading) {
			let html = this.parser.parseInline(tokens);
			const explicitId = html.match(/\{#([\w-]+)\}\s*$/);
			let id: string;

			if (explicitId) {
				id = explicitId[1];
				html = html.slice(0, explicitId.index).trim();
			} else {
				id = slugify(html);
			}

			return `<h${depth} id="${id}">${html}</h${depth}>\n`;
		},
		link({href, title, tokens}: Tokens.Link) {
			const text = this.parser.parseInline(tokens);
			const isExternal = /^https?:\/\//.test(href);
			const titleAttr = title ? ` title="${title}"` : "";
			const externalAttrs = isExternal ? ` target="_blank" rel="noopener noreferrer"` : "";
			return `<a href="${href}"${titleAttr}${externalAttrs}>${text}</a>`;
		},
	},
});

const renderedHtml = computed(() => {
	const rawHtml = marked.parse(props.source, {async: false}) as string;
	return DOMPurify.sanitize(rawHtml, {ADD_ATTR: ["target"]});
});

/** Intercept clicks on in-page `#anchor` links to smooth-scroll instead of a hard navigation. */
function onClick(event: MouseEvent) {
	const anchor = (event.target as HTMLElement).closest("a");
	if (!anchor) {
		return;
	}

	const href = anchor.getAttribute("href") || "";
	if (!href.startsWith("#")) {
		return;
	}

	event.preventDefault();
	const id = href.slice(1);
	const target = root.value?.querySelector(`#${CSS.escape(id)}`);

	if (target) {
		target.scrollIntoView({behavior: "smooth", block: "start"});
	} else {
		emit("anchor-not-found", id);
	}
}
</script>

<style scoped lang="scss">
.markdown-viewer {
	line-height: 1.6;
	color: var(--pb-text);

	:deep(h1), :deep(h2), :deep(h3), :deep(h4) {
		font-family: var(--pb-font-display);
		font-weight: 600;
		color: var(--pb-text);
		margin-top: 1.6em;
		margin-bottom: 0.6em;
		line-height: 1.3;
	}

	:deep(h1) {
		font-size: 28px;
		margin-top: 0;
	}

	:deep(h2) {
		font-size: 22px;
		border-bottom: 1px solid var(--pb-border);
		padding-bottom: 0.3em;
	}

	:deep(h3) {
		font-size: 17px;
	}

	:deep(h4) {
		font-size: 15px;
	}

	:deep(p), :deep(ul), :deep(ol) {
		margin: 0 0 1em 0;
		font-size: 14px;
	}

	:deep(ul), :deep(ol) {
		padding-left: 1.4em;
	}

	:deep(li) {
		margin-bottom: 0.35em;
		font-size: 14px;
	}

	:deep(li) > :deep(p) {
		margin: 0;
	}

	:deep(a) {
		color: var(--pb-primary);
		text-decoration: none;
	}

	:deep(a:hover) {
		text-decoration: underline;
	}

	:deep(code) {
		font-family: var(--pb-font-mono);
		background: var(--pb-surface-alt);
		border-radius: 4px;
		padding: 0.15em 0.4em;
		font-size: 0.9em;
	}

	:deep(pre) {
		font-family: var(--pb-font-mono);
		background: var(--pb-nav-bg);
		color: var(--pb-nav-text);
		border-radius: 8px;
		padding: 14px 16px;
		overflow-x: auto;
		margin: 0 0 1em 0;
	}

	:deep(pre code) {
		background: transparent;
		padding: 0;
		color: inherit;
	}

	:deep(blockquote) {
		margin: 0 0 1em 0;
		padding: 0.4em 1em;
		border-left: 4px solid var(--pb-primary);
		background: var(--pb-surface-alt);
		color: var(--pb-text-muted);
	}

	:deep(img) {
		max-width: 100%;
		border-radius: 8px;
	}

	:deep(table) {
		border-collapse: collapse;
		width: 100%;
		margin: 0 0 1em 0;
		font-size: 14px;
	}

	:deep(th), :deep(td) {
		border: 1px solid var(--pb-border);
		padding: 8px 10px;
		text-align: left;
	}

	:deep(th) {
		background: var(--pb-surface-alt);
	}

	:deep(hr) {
		border: none;
		border-top: 1px solid var(--pb-border);
		margin: 2em 0;
	}
}
</style>
