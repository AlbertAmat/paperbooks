import {LegalBlock} from "@/views/legal/legalTypes";

export const privacyPolicyEn: LegalBlock[] = [
    {type: "paragraph", text: "Last updated: 01-01-2026"},
    {
        type: "paragraph",
        text: "This Privacy Policy explains how [Your Organization Name] (\"we\", \"us\") processes personal data through Paper Book (the \"App\"), in accordance with Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018 on Data Protection and Digital Rights Guarantee (LOPDGDD)."
    },
    {type: "heading", text: "1. Data controller"},
    {
        type: "list",
        items: [
            "Name: [Your Organization Name]",
            "Contact: [privacy@example.com]",
            "Address: [Your Address]"
        ]
    },
    {type: "heading", text: "2. What data we process"},
    {type: "paragraph", text: "Paper Book is a library and lending management tool. Depending on how it is used, we may process:"},
    {
        type: "list",
        items: [
            "Account data — name, email address, language preference, and an encrypted password, for people who log in to the App.",
            "Catalog data — books, stock, categories, authors, and locations entered by the App's users.",
            "Borrower data — the name and contact details of the people who borrow books, entered by the App's users.",
            "Technical data — IP address and session identifiers, generated automatically while you use the App."
        ]
    },
    {type: "heading", text: "3. Purpose and legal basis"},
    {
        type: "table",
        headers: ["Purpose", "Legal basis"],
        rows: [
            ["Provide and maintain your account and session", "Performance of a contract (Art. 6.1.b GDPR)"],
            ["Store and manage the catalog and lending records you enter", "Performance of a contract / legitimate interest (Art. 6.1.b/f GDPR)"],
            ["Keep the service secure and prevent abuse", "Legitimate interest (Art. 6.1.f GDPR)"]
        ]
    },
    {type: "heading", text: "4. Data retention"},
    {
        type: "paragraph",
        text: "Personal data is kept for as long as your account remains active, or as long as necessary to fulfil the purposes described above, unless a longer retention period is required by law."
    },
    {type: "heading", text: "5. Data sharing"},
    {
        type: "paragraph",
        text: "We do not sell personal data. Data may be shared with hosting or infrastructure providers strictly to operate the App, under appropriate data processing agreements."
    },
    {type: "heading", text: "6. International transfers"},
    {
        type: "paragraph",
        text: "[Describe here if data leaves the European Economic Area, and which safeguards apply — e.g. Standard Contractual Clauses under Chapter V GDPR. If all data stays within the EEA, state that instead.]"
    },
    {type: "heading", text: "7. Your rights"},
    {
        type: "paragraph",
        text: "Under the GDPR and the LOPDGDD, you may exercise your rights of access, rectification, erasure, restriction, portability, and objection by contacting us at [privacy@example.com]. You also have the right to lodge a complaint with the Spanish Data Protection Agency (Agencia Española de Protección de Datos, www.aepd.es) or your local supervisory authority."
    },
    {type: "heading", text: "8. Security"},
    {
        type: "paragraph",
        text: "We apply reasonable technical and organizational measures to protect personal data against unauthorized access, loss, or alteration."
    },
    {type: "heading", text: "9. Changes to this policy"},
    {
        type: "paragraph",
        text: "We may update this Privacy Policy from time to time. Material changes will be reflected by updating the \"Last updated\" date above."
    },
    {type: "heading", text: "10. Contact"},
    {type: "paragraph", text: "For any question about this policy, contact us at [privacy@example.com]."}
];
