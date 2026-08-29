/**
 * Static content + i18n for the legal view (`LegalView.vue`): privacy
 * policy, terms of service, and cookie policy, each authored once per
 * locale in `content/<locale>/*.ts` as `LegalBlock[]`. Locale here is
 * independent of `i18n.ts` (there's no server round trip - it's all
 * hardcoded per the `LegalLocale` union) but is driven by the same current
 * app language.
 */
import {LegalBlock} from "@/views/legal/legalTypes";

import {privacyPolicyEn} from "./content/en/privacy-policy";
import {privacyPolicyEs} from "./content/es/privacy-policy";
import {privacyPolicyCa} from "./content/ca/privacy-policy";
import {privacyPolicyIt} from "./content/it/privacy-policy";

import {termsOfServiceEn} from "./content/en/terms-of-service";
import {termsOfServiceEs} from "./content/es/terms-of-service";
import {termsOfServiceCa} from "./content/ca/terms-of-service";
import {termsOfServiceIt} from "./content/it/terms-of-service";

import {cookiePolicyEn} from "./content/en/cookie-policy";
import {cookiePolicyEs} from "./content/es/cookie-policy";
import {cookiePolicyCa} from "./content/ca/cookie-policy";
import {cookiePolicyIt} from "./content/it/cookie-policy";

export type LegalLocale = "en" | "es" | "ca" | "it";

export const DEFAULT_LEGAL_LOCALE: LegalLocale = "en";

const SUPPORTED_LEGAL_LOCALES: LegalLocale[] = ["en", "es", "ca", "it"];

/** Fall back to `DEFAULT_LEGAL_LOCALE` ("en") for any unsupported/missing locale. */
export function normalizeLegalLocale(locale: string | undefined | null): LegalLocale {
    return (SUPPORTED_LEGAL_LOCALES as string[]).includes(locale || "")
        ? (locale as LegalLocale)
        : DEFAULT_LEGAL_LOCALE;
}

export const legalUiLabels: Record<LegalLocale, {
    pageTitle: string;
    sidebarHeading: string;
    footerPrivacyPolicy: string;
    footerTermsOfService: string;
    footerCookiePolicy: string;
    footerCopyright: string;
    cookieConsentTitle: string;
    cookieConsentMessage: string;
    cookieConsentAccept: string;
    cookieConsentLearnMore: string;
}> = {
    en: {
        pageTitle: "Legal",
        sidebarHeading: "Legal",
        footerPrivacyPolicy: "Privacy Policy",
        footerTermsOfService: "Terms of Service",
        footerCookiePolicy: "Cookie Policy",
        footerCopyright: "Paper Book",
        cookieConsentTitle: "Cookies",
        cookieConsentMessage: "This app only uses a strictly necessary cookie to keep you logged in. No analytics or tracking cookies are used.",
        cookieConsentAccept: "Got it",
        cookieConsentLearnMore: "Cookie Policy",
    },
    es: {
        pageTitle: "Legal",
        sidebarHeading: "Legal",
        footerPrivacyPolicy: "Política de Privacidad",
        footerTermsOfService: "Términos de Servicio",
        footerCookiePolicy: "Política de Cookies",
        footerCopyright: "Paper Book",
        cookieConsentTitle: "Cookies",
        cookieConsentMessage: "Esta aplicación solo utiliza una cookie estrictamente necesaria para mantener tu sesión iniciada. No se usan cookies de análisis ni de seguimiento.",
        cookieConsentAccept: "Entendido",
        cookieConsentLearnMore: "Política de Cookies",
    },
    ca: {
        pageTitle: "Legal",
        sidebarHeading: "Legal",
        footerPrivacyPolicy: "Política de Privacitat",
        footerTermsOfService: "Termes de Servei",
        footerCookiePolicy: "Política de Cookies",
        footerCopyright: "Paper Book",
        cookieConsentTitle: "Cookies",
        cookieConsentMessage: "Aquesta aplicació només utilitza una cookie estrictament necessària per mantenir la teva sessió iniciada. No s'utilitzen cookies d'anàlisi ni de seguiment.",
        cookieConsentAccept: "Entès",
        cookieConsentLearnMore: "Política de Cookies",
    },
    it: {
        pageTitle: "Legale",
        sidebarHeading: "Legale",
        footerPrivacyPolicy: "Informativa sulla Privacy",
        footerTermsOfService: "Termini di Servizio",
        footerCookiePolicy: "Cookie Policy",
        footerCopyright: "Paper Book",
        cookieConsentTitle: "Cookie",
        cookieConsentMessage: "Questa app utilizza solo un cookie strettamente necessario per mantenere la tua sessione attiva. Non vengono utilizzati cookie di analisi o di tracciamento.",
        cookieConsentAccept: "Ho capito",
        cookieConsentLearnMore: "Cookie Policy",
    },
};

interface LegalDocTranslation {
    title: string;
    blocks: LegalBlock[];
}

interface LegalDocDefinition {
    id: string;
    icon: string;
    translations: Record<LegalLocale, LegalDocTranslation>;
}

const legalDocDefinitions: LegalDocDefinition[] = [
    {
        id: "privacy-policy",
        icon: "mdi-shield-account-outline",
        translations: {
            en: {title: "Privacy Policy", blocks: privacyPolicyEn},
            es: {title: "Política de Privacidad", blocks: privacyPolicyEs},
            ca: {title: "Política de Privacitat", blocks: privacyPolicyCa},
            it: {title: "Informativa sulla Privacy", blocks: privacyPolicyIt},
        },
    },
    {
        id: "terms-of-service",
        icon: "mdi-file-document-outline",
        translations: {
            en: {title: "Terms of Service", blocks: termsOfServiceEn},
            es: {title: "Términos de Servicio", blocks: termsOfServiceEs},
            ca: {title: "Termes de Servei", blocks: termsOfServiceCa},
            it: {title: "Termini di Servizio", blocks: termsOfServiceIt},
        },
    },
    {
        id: "cookie-policy",
        icon: "mdi-cookie-outline",
        translations: {
            en: {title: "Cookie Policy", blocks: cookiePolicyEn},
            es: {title: "Política de Cookies", blocks: cookiePolicyEs},
            ca: {title: "Política de Cookies", blocks: cookiePolicyCa},
            it: {title: "Cookie Policy", blocks: cookiePolicyIt},
        },
    },
];

export interface LegalDoc {
    id: string;
    icon: string;
    title: string;
    blocks: LegalBlock[];
}

/** All three legal documents, titled and rendered in the given locale (normalized). */
export function getLegalDocs(locale: string | undefined | null): LegalDoc[] {
    const legalLocale = normalizeLegalLocale(locale);

    return legalDocDefinitions.map(definition => ({
        id: definition.id,
        icon: definition.icon,
        title: definition.translations[legalLocale].title,
        blocks: definition.translations[legalLocale].blocks,
    }));
}

/** Look up one legal document by id (e.g. "privacy-policy"); falls back to the first doc if not found. */
export function getLegalDoc(id: string | undefined, locale: string | undefined | null): LegalDoc {
    const docs = getLegalDocs(locale);
    return docs.find(doc => doc.id === id) || docs[0];
}
