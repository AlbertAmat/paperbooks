/** Italian translation of the Privacy Policy, rendered by LegalContent.vue. Content data only, edited by legal/product, not app logic. */
import {LegalBlock} from "@/views/legal/legalTypes";

export const privacyPolicyIt: LegalBlock[] = [
    {type: "paragraph", text: "Ultimo aggiornamento: 01-01-2026"},
    {
        type: "paragraph",
        text: "La presente Informativa sulla Privacy spiega come [Nome della tua Organizzazione] (\"noi\") tratta i dati personali attraverso Vaultisse (l'\"App\"), in conformità al Regolamento (UE) 2016/679 (GDPR) e, ove applicabile, alla normativa spagnola LOPDGDD."
    },
    {type: "heading", text: "1. Titolare del trattamento"},
    {
        type: "list",
        items: [
            "Nome: [Nome della tua Organizzazione]",
            "Contatto: [privacy@example.com]",
            "Indirizzo: [Il tuo Indirizzo]"
        ]
    },
    {type: "heading", text: "2. Quali dati trattiamo"},
    {type: "paragraph", text: "Vaultisse è uno strumento di gestione di biblioteca e prestiti. A seconda dell'uso che ne viene fatto, possiamo trattare:"},
    {
        type: "list",
        items: [
            "Dati dell'account — nome, indirizzo email, lingua preferita e password cifrata, per le persone che accedono all'App.",
            "Dati del catalogo — libri, copie, categorie, autori e ubicazioni inseriti dagli utenti dell'App.",
            "Dati dei lettori — nome e recapiti delle persone che prendono in prestito i libri, inseriti dagli utenti dell'App.",
            "Dati tecnici — indirizzo IP e identificatori di sessione, generati automaticamente durante l'uso dell'App."
        ]
    },
    {type: "heading", text: "3. Finalità e base giuridica"},
    {
        type: "table",
        headers: ["Finalità", "Base giuridica"],
        rows: [
            ["Fornire e mantenere il tuo account e la tua sessione", "Esecuzione di un contratto (art. 6.1.b GDPR)"],
            ["Archiviare e gestire il catalogo e i registri di prestito inseriti", "Esecuzione di un contratto / legittimo interesse (art. 6.1.b/f GDPR)"],
            ["Mantenere il servizio sicuro e prevenire abusi", "Legittimo interesse (art. 6.1.f GDPR)"]
        ]
    },
    {type: "heading", text: "4. Conservazione dei dati"},
    {
        type: "paragraph",
        text: "I dati personali sono conservati per tutto il tempo in cui il tuo account rimane attivo, o per il tempo necessario a soddisfare le finalità sopra descritte, salvo un periodo di conservazione più lungo richiesto dalla legge."
    },
    {type: "heading", text: "5. Condivisione dei dati"},
    {
        type: "paragraph",
        text: "Non vendiamo dati personali. I dati possono essere condivisi con fornitori di hosting o infrastruttura, esclusivamente per gestire l'App, nell'ambito di appositi accordi sul trattamento dei dati."
    },
    {type: "heading", text: "6. Trasferimenti internazionali"},
    {
        type: "paragraph",
        text: "[Descrivi qui se i dati escono dallo Spazio Economico Europeo e quali garanzie si applicano — ad es. Clausole Contrattuali Standard ai sensi del Capo V del GDPR. Se tutti i dati restano nel SEE, indicalo invece.]"
    },
    {type: "heading", text: "7. I tuoi diritti"},
    {
        type: "paragraph",
        text: "Ai sensi del GDPR, puoi esercitare i tuoi diritti di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione scrivendo a [privacy@example.com]. Hai inoltre il diritto di presentare un reclamo all'autorità di controllo del tuo paese (ad esempio, l'Autorità Garante per la protezione dei dati personali)."
    },
    {type: "heading", text: "8. Sicurezza"},
    {
        type: "paragraph",
        text: "Applichiamo misure tecniche e organizzative ragionevoli per proteggere i dati personali da accessi non autorizzati, perdita o alterazione."
    },
    {type: "heading", text: "9. Modifiche alla presente informativa"},
    {
        type: "paragraph",
        text: "Potremmo aggiornare periodicamente questa Informativa sulla Privacy. Le modifiche rilevanti saranno riflesse aggiornando la data \"Ultimo aggiornamento\" sopra indicata."
    },
    {type: "heading", text: "10. Contatti"},
    {type: "paragraph", text: "Per qualsiasi domanda su questa informativa, contattaci all'indirizzo [privacy@example.com]."}
];
