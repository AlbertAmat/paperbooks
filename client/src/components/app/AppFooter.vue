<template>
	<v-footer app border="t" color="white" class="app-footer px-5">
		<span class="text-medium-emphasis">© {{ year }} {{ uiLabels.footerCopyright }}</span>

		<v-spacer></v-spacer>

		<router-link :to="legalRoute.getPath('privacy-policy')">{{ uiLabels.footerPrivacyPolicy }}</router-link>
		<router-link :to="legalRoute.getPath('terms-of-service')">{{ uiLabels.footerTermsOfService }}</router-link>
		<router-link :to="legalRoute.getPath('cookie-policy')">{{ uiLabels.footerCookiePolicy }}</router-link>
	</v-footer>
</template>

<script setup lang="ts">
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

	a {
		margin-left: 20px;
		color: inherit;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
}
</style>
