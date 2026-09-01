/** Italian translation of the Cookie Policy, rendered by LegalContent.vue. Content data only, edited by legal/product, not app logic. */
import {LegalBlock} from "@/views/legal/legalTypes";

export const cookiePolicyIt: LegalBlock[] = [
    {type: "paragraph", text: "Ultimo aggiornamento: 01-01-2026"},
    {
        type: "paragraph",
        text: "La presente Cookie Policy spiega quali cookie utilizza Vaultisse (l'\"App\") e per quale motivo, in conformità al GDPR e alla normativa applicabile in materia."
    },
    {type: "heading", text: "1. Cos'è un cookie?"},
    {
        type: "paragraph",
        text: "Un cookie è un piccolo file memorizzato sul tuo dispositivo che consente a un sito web o a un'applicazione di riconoscere il tuo browser tra diverse richieste."
    },
    {type: "heading", text: "2. Cookie che utilizziamo"},
    {type: "paragraph", text: "Vaultisse utilizza attualmente solo cookie tecnici strettamente necessari:"},
    {
        type: "table",
        headers: ["Cookie", "Finalità", "Tipo", "Durata"],
        rows: [
            ["Cookie di sessione", "Mantiene la tua sessione attiva e autentica le tue richieste al server", "Strettamente necessario", "Sessione / fino al logout"]
        ]
    },
    {
        type: "paragraph",
        text: "Questi cookie non richiedono un consenso preventivo, poiché sono indispensabili per fornire il servizio che richiedi espressamente effettuando l'accesso."
    },
    {type: "heading", text: "3. Cookie che NON utilizziamo"},
    {
        type: "paragraph",
        text: "Vaultisse non utilizza attualmente cookie di analisi, pubblicitari o di tracciamento di terze parti. Se ciò cambiasse in futuro, questa policy sarà aggiornata e, ove richiesto, ti sarà chiesto il consenso prima di installare tali cookie."
    },
    {type: "heading", text: "4. Gestione dei cookie"},
    {
        type: "paragraph",
        text: "Poiché vengono utilizzati solo cookie strettamente necessari, disabilitarli tramite le impostazioni del browser impedirà l'accesso o l'uso dell'App. Puoi rivedere o eliminare i cookie in qualsiasi momento dalle impostazioni del tuo browser."
    },
    {type: "heading", text: "5. Modifiche a questa policy"},
    {
        type: "paragraph",
        text: "Potremmo aggiornare questa Cookie Policy se cambiano i cookie utilizzati dall'App. Controlla la data di \"Ultimo aggiornamento\" per la versione più recente."
    },
    {type: "heading", text: "6. Contatti"},
    {type: "paragraph", text: "Domande su questa Cookie Policy possono essere inviate a [privacy@example.com]."}
];
