/** Traduzione italiana del riepilogo delle Misure di Sicurezza, renderizzato da LegalContent.vue. Solo dati di contenuto, gestiti da legale/prodotto, non logica dell'app. */
import {LegalBlock} from "@/views/legal/legalTypes";

export const securityMeasuresIt: LegalBlock[] = [
    {type: "paragraph", text: "Ultimo aggiornamento: 29-08-2026"},
    {
        type: "paragraph",
        text: "Questo documento riassume le misure di sicurezza tecniche e organizzative integrate in Vaultisse. È redatto affinché [Nome della tua Organizzazione] lo utilizzi come riferimento nella propria valutazione dei rischi di sicurezza, inclusa, ove applicabile, un'autovalutazione dell'Esquema Nacional de Seguridad (ENS) spagnolo o una revisione ai sensi dell'articolo 32 del RGPD/LOPDGDD. Descrive i controlli forniti dall'applicazione stessa; la sicurezza dell'hosting, della rete e dei backup rimane responsabilità di chi gestisce questa istanza (vedi sezione 6)."
    },
    {type: "heading", text: "1. Autenticazione e gestione delle sessioni"},
    {
        type: "list",
        items: [
            "Le password sono cifrate con bcrypt (fattore di costo 12); l'applicazione non memorizza né registra mai una password in chiaro.",
            "I token di sessione sono JSON Web Token firmati, limitati all'algoritmo HS256, trasportati in un cookie httpOnly, Secure e SameSite=Strict che gli script della pagina non possono mai leggere.",
            "Cambiare una password revoca immediatamente ogni altro token di sessione già emesso per quell'account, incluso uno rubato.",
            "L'accesso e la registrazione sono soggetti a limiti di frequenza per indirizzo IP, per rallentare tentativi di forza bruta e credential stuffing."
        ]
    },
    {type: "heading", text: "2. Protezione e minimizzazione dei dati"},
    {
        type: "list",
        items: [
            "Ogni query al database utilizza istruzioni parametrizzate; i dati inseriti dall'utente non vengono mai concatenati nel testo SQL.",
            "I registri dei prestatari memorizzano solo un nome e, facoltativamente, un gruppo: l'applicazione non raccoglie dati di contatto, numeri identificativi o date di nascita.",
            "Gli account contrassegnati come istituzione pubblica ricevono un promemoria all'interno dell'app per usare codici o identificativi anziché nomi completi quando il gruppo gestito include minori o altre persone particolarmente vulnerabili.",
            "L'eliminazione di un record lo rimuove definitivamente dal database; non esiste un flag di eliminazione logica che ne lasci una copia residua."
        ]
    },
    {type: "heading", text: "3. Controllo degli accessi"},
    {
        type: "list",
        items: [
            "Il catalogo, i prestatari e le impostazioni di ogni account sono isolati da quelli di ogni altro account a livello di database.",
            "Il caricamento di file (copertine dei libri, immagini del profilo) è limitato a PNG/JPEG e a una dimensione massima fissa.",
            "Ogni richiesta che modifica dati richiede una sessione autenticata valida e non scaduta."
        ]
    },
    {type: "heading", text: "4. Sicurezza di rete e trasporto"},
    {
        type: "list",
        items: [
            "La condivisione di risorse tra origini diverse (CORS) è limitata all'unica origine configurata per l'applicazione, mai a un carattere jolly.",
            "Una Content-Security-Policy e le intestazioni di sicurezza standard vengono impostate su ogni risposta.",
            "La cifratura del traffico in transito (HTTPS/TLS) è configurata da chi gestisce l'istanza, a livello di reverse proxy o tunnel; consulta la guida al deployment."
        ]
    },
    {type: "heading", text: "5. Manutenzione continua"},
    {
        type: "list",
        items: [
            "Le dipendenze sono mantenute aggiornate e verificate per vulnerabilità note prima di ogni rilascio.",
            "I problemi di sicurezza possono essere segnalati privatamente anziché come issue pubblica; consulta SECURITY.md nel repository del progetto."
        ]
    },
    {type: "heading", text: "6. Ciò che resta di responsabilità di chi gestisce l'istanza"},
    {
        type: "paragraph",
        text: "Vaultisse è un software self-hosted, non un servizio gestito. [Nome della tua Organizzazione] è il titolare del trattamento per qualsiasi dato personale inserito in questa istanza ed è responsabile di: terminazione TLS/HTTPS, sicurezza dell'host e della rete, backup del database e loro cifratura, tempi di conservazione ed eliminazione dei dati, e qualsiasi obbligo settoriale applicabile, incluso il RGPD/LOPDGDD e, per gli enti pubblici spagnoli, l'Esquema Nacional de Seguridad (Regio Decreto 311/2022)."
    },
    {
        type: "paragraph",
        text: "Questo riepilogo descrive i controlli integrati nell'applicazione e non costituisce, di per sé, una certificazione di conformità a uno standard specifico."
    },
];
