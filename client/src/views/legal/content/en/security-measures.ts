/** English translation of the Security Measures summary, rendered by LegalContent.vue. Content data only, edited by legal/product, not app logic. */
import {LegalBlock} from "@/views/legal/legalTypes";

export const securityMeasuresEn: LegalBlock[] = [
    {type: "paragraph", text: "Last updated: 29-08-2026"},
    {
        type: "paragraph",
        text: "This document summarizes the technical and organizational security measures built into Vaultisse. It is written for [Your Organization Name] to reference in its own security risk assessment - including, where applicable, an Esquema Nacional de Seguridad (ENS) self-assessment or a GDPR/LOPDGDD Article 32 review. It describes controls the application itself provides; hosting, network, and backup security remain the responsibility of whoever operates this instance (see section 6)."
    },
    {type: "heading", text: "1. Authentication and session management"},
    {
        type: "list",
        items: [
            "Passwords are hashed with bcrypt (cost factor 12); the application never stores or logs a password in plain text.",
            "Session tokens are signed JSON Web Tokens restricted to the HS256 algorithm, carried in an httpOnly, Secure, SameSite=Strict cookie that page scripts can never read.",
            "Changing a password immediately revokes every other session token already issued for that account, including a stolen one.",
            "Login and registration are rate-limited per IP address to slow down credential-stuffing and brute-force attempts."
        ]
    },
    {type: "heading", text: "2. Data protection and minimization"},
    {
        type: "list",
        items: [
            "Every database query uses parameterized statements; user input is never concatenated into SQL text.",
            "Borrower/lending records store only a name and an optional group - no contact details, identification numbers, or dates of birth are collected by the application.",
            "Accounts flagged as a public institution are shown an in-app reminder to use codes or identifiers instead of full names when the group being tracked includes minors or other sensitive individuals.",
            "Deleting a record permanently removes it from the database; no soft-delete flag leaves a lingering copy behind."
        ]
    },
    {type: "heading", text: "3. Access control"},
    {
        type: "list",
        items: [
            "Every account's catalog, borrowers, and settings are isolated from every other account at the database level.",
            "File uploads (cover images, profile pictures) are restricted to PNG/JPEG and a fixed size limit.",
            "Every state-changing request requires a valid, unexpired authenticated session."
        ]
    },
    {type: "heading", text: "4. Network and transport security"},
    {
        type: "list",
        items: [
            "Cross-Origin Resource Sharing is restricted to the single configured application origin, never a wildcard.",
            "A Content-Security-Policy and standard security response headers are set on every request.",
            "Encrypting traffic in transit (HTTPS/TLS) is configured by the operator at the reverse proxy or tunnel level - see the deployment guide."
        ]
    },
    {type: "heading", text: "5. Ongoing maintenance"},
    {
        type: "list",
        items: [
            "Dependencies are kept current and checked for known vulnerabilities before each release.",
            "Security issues can be reported privately rather than as a public issue - see SECURITY.md in the project repository."
        ]
    },
    {type: "heading", text: "6. What remains the operator's responsibility"},
    {
        type: "paragraph",
        text: "Vaultisse is self-hosted software, not a managed service. [Your Organization Name] is the data controller for any personal data entered into this instance and is responsible for: TLS/HTTPS termination, host and network security, database backups and their encryption, data retention and deletion schedules, and any sector-specific obligation that applies to it - including GDPR/LOPDGDD, and, for Spanish public-sector bodies, the Esquema Nacional de Seguridad (Royal Decree 311/2022)."
    },
    {
        type: "paragraph",
        text: "This summary describes the application's built-in controls and does not, by itself, constitute certification of compliance with any specific standard."
    },
];
