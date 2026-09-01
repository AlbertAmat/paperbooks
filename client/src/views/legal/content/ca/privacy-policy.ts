/** Catalan translation of the Privacy Policy, rendered by LegalContent.vue. Content data only, edited by legal/product, not app logic. */
import {LegalBlock} from "@/views/legal/legalTypes";

export const privacyPolicyCa: LegalBlock[] = [
    {type: "paragraph", text: "Darrera actualització: 01-01-2026"},
    {
        type: "paragraph",
        text: "Aquesta Política de Privacitat explica com [Nom de la teva Organització] (\"nosaltres\") tracta les dades personals a través de Vaultisse (l'\"Aplicació\"), de conformitat amb el Reglament (UE) 2016/679 (RGPD) i la Llei Orgànica 3/2018, de Protecció de Dades Personals i garantia dels drets digitals (LOPDGDD)."
    },
    {type: "heading", text: "1. Responsable del tractament"},
    {
        type: "list",
        items: [
            "Nom: [Nom de la teva Organització]",
            "Contacte: [privacy@example.com]",
            "Adreça: [La teva Adreça]"
        ]
    },
    {type: "heading", text: "2. Quines dades tractem"},
    {type: "paragraph", text: "Vaultisse és una eina de gestió de biblioteca i préstecs. Segons l'ús que se'n faci, podem tractar:"},
    {
        type: "list",
        items: [
            "Dades de compte — nom, correu electrònic, idioma preferit i contrasenya xifrada, de les persones que inicien sessió a l'Aplicació.",
            "Dades de catàleg — llibres, exemplars, categories, autors i ubicacions introduïts pels usuaris de l'Aplicació.",
            "Dades dels prestataris — nom i dades de contacte de les persones que agafen llibres en préstec, introduïdes pels usuaris de l'Aplicació.",
            "Dades tècniques — adreça IP i identificadors de sessió, generats automàticament mentre uses l'Aplicació."
        ]
    },
    {type: "heading", text: "3. Finalitat i base jurídica"},
    {
        type: "table",
        headers: ["Finalitat", "Base jurídica"],
        rows: [
            ["Prestar i mantenir el teu compte i la teva sessió", "Execució d'un contracte (art. 6.1.b RGPD)"],
            ["Emmagatzemar i gestionar el catàleg i els registres de préstec que introdueixes", "Execució d'un contracte / interès legítim (art. 6.1.b/f RGPD)"],
            ["Mantenir el servei segur i prevenir usos indeguts", "Interès legítim (art. 6.1.f RGPD)"]
        ]
    },
    {type: "heading", text: "4. Conservació de les dades"},
    {
        type: "paragraph",
        text: "Les dades personals es conserven mentre el teu compte romangui actiu, o durant el temps necessari per complir les finalitats descrites, llevat que la llei exigeixi un termini de conservació més llarg."
    },
    {type: "heading", text: "5. Comunicació de dades"},
    {
        type: "paragraph",
        text: "No venem dades personals. Les dades es poden compartir amb proveïdors d'allotjament o infraestructura, estrictament per operar l'Aplicació, sota els corresponents contractes d'encàrrec de tractament."
    },
    {type: "heading", text: "6. Transferències internacionals"},
    {
        type: "paragraph",
        text: "[Descriu aquí si les dades surten de l'Espai Econòmic Europeu i quines garanties s'apliquen — p. ex. Clàusules Contractuals Tipus del Capítol V del RGPD. Si totes les dades romanen dins l'EEE, indica-ho en el seu lloc.]"
    },
    {type: "heading", text: "7. Els teus drets"},
    {
        type: "paragraph",
        text: "D'acord amb el RGPD i la LOPDGDD, pots exercir els teus drets d'accés, rectificació, supressió, limitació, portabilitat i oposició escrivint a [privacy@example.com]. També tens dret a presentar una reclamació davant l'Agència Espanyola de Protecció de Dades (www.aepd.es) o davant l'autoritat de control del teu país."
    },
    {type: "heading", text: "8. Seguretat"},
    {
        type: "paragraph",
        text: "Apliquem mesures tècniques i organitzatives raonables per protegir les dades personals davant d'accessos no autoritzats, pèrdua o alteració."
    },
    {type: "heading", text: "9. Canvis en aquesta política"},
    {
        type: "paragraph",
        text: "Podem actualitzar aquesta Política de Privacitat periòdicament. Els canvis rellevants es reflectiran actualitzant la data de \"Darrera actualització\" indicada a dalt."
    },
    {type: "heading", text: "10. Contacte"},
    {type: "paragraph", text: "Per a qualsevol dubte sobre aquesta política, contacta amb nosaltres a [privacy@example.com]."}
];
