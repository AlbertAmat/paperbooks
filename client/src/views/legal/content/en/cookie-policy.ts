/** English translation of the Cookie Policy, rendered by LegalContent.vue. Content data only, edited by legal/product, not app logic. */
import {LegalBlock} from "@/views/legal/legalTypes";

export const cookiePolicyEn: LegalBlock[] = [
    {type: "paragraph", text: "Last updated: 01-01-2026"},
    {
        type: "paragraph",
        text: "This Cookie Policy explains what cookies Paper Book (the \"App\") uses and why, in accordance with the Spanish LSSI-CE (Law on Information Society Services) and the GDPR."
    },
    {type: "heading", text: "1. What is a cookie?"},
    {
        type: "paragraph",
        text: "A cookie is a small file stored on your device that allows a website or application to recognize your browser across requests."
    },
    {type: "heading", text: "2. Cookies we use"},
    {type: "paragraph", text: "Paper Book currently uses only strictly necessary (technical) cookies:"},
    {
        type: "table",
        headers: ["Cookie", "Purpose", "Type", "Duration"],
        rows: [
            ["Session cookie", "Keeps you logged in and authenticates your requests to the server", "Strictly necessary", "Session / until logout"]
        ]
    },
    {
        type: "paragraph",
        text: "These cookies do not require prior consent under Article 22.2 of the LSSI-CE, because they are essential to provide the service you explicitly request by logging in."
    },
    {type: "heading", text: "3. Cookies we do NOT use"},
    {
        type: "paragraph",
        text: "Paper Book does not currently use analytics, advertising, or third-party tracking cookies. If this changes in the future, this policy will be updated and, where required, your consent will be requested before such cookies are set."
    },
    {type: "heading", text: "4. Managing cookies"},
    {
        type: "paragraph",
        text: "Since only strictly necessary cookies are used, disabling them through your browser settings will prevent you from logging in or using the App. You can review or delete cookies at any time through your browser's settings."
    },
    {type: "heading", text: "5. Changes to this policy"},
    {
        type: "paragraph",
        text: "We may update this Cookie Policy if the cookies used by the App change. Check the \"Last updated\" date for the latest version."
    },
    {type: "heading", text: "6. Contact"},
    {type: "paragraph", text: "Questions about this Cookie Policy can be sent to [privacy@example.com]."}
];
