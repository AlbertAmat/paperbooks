<template>
	<v-footer app border="t" class="app-footer px-5">
		<span class="text-medium-emphasis">© {{ year }} {{ uiLabels.footerCopyright }}</span>

		<v-spacer></v-spacer>

		<router-link :to="legalRoute.getPath('privacy-policy')">{{ uiLabels.footerPrivacyPolicy }}</router-link>
		<router-link :to="legalRoute.getPath('terms-of-service')">{{ uiLabels.footerTermsOfService }}</router-link>
		<router-link :to="legalRoute.getPath('cookie-policy')">{{ uiLabels.footerCookiePolicy }}</router-link>
	</v-footer>
</template>

<script setup lang="ts">
/** App-wide footer: copyright line and links to the legal documents (see LegalRoute/legalData.ts). */
import {computed} from "vue";
import {useI18n} from "vue-i18n";
import {legalUiLabels, normalizeLegalLocale} from "@/views/legal/legalData";
import {legalRoute} from "@/router/routes/LegalRoute";

const {locale} = useI18n();

const year = new Date().getFullYear();

const uiLabels = computed(() => legalUiLabels[normalizeLegalLocale(locale.value)]);
</script>

<style scoped lang="scss">
.app-footer {
	font-size: 13px;
	min-height: 40px !important;
	height: 40px;
	background: var(--pb-surface) !important;
	color: var(--pb-text-muted);

	a {
		margin-left: 20px;
		color: inherit;
		text-decoration: none;

		&:hover {
			color: var(--pb-primary);
			text-decoration: underline;
		}
	}
}

/*
 * The copyright line plus three links don't fit on one row at phone widths -
 * wrap instead of clipping, and let the footer grow past its usual 40px to
 * fit the extra line (v-footer's `app` prop keeps the layout's reserved
 * space in sync with this automatically).
 */
@media (max-width: 600px) {
	.app-footer {
		height: auto !important;
		min-height: 40px !important;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px 16px;
		padding-top: 8px;
		padding-bottom: 8px;
		text-align: center;
	}

	.app-footer a {
		margin-left: 0;
	}

	.app-footer :deep(.v-spacer) {
		display: none;
	}
}
</style>
