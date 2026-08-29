/** Traducció al català del resum de Mesures de Seguretat, renderitzat per LegalContent.vue. Només dades de contingut, editat per legal/producte, no lògica de l'app. */
import {LegalBlock} from "@/views/legal/legalTypes";

export const securityMeasuresCa: LegalBlock[] = [
    {type: "paragraph", text: "Última actualització: 29-08-2026"},
    {
        type: "paragraph",
        text: "Aquest document resumeix les mesures de seguretat tècniques i organitzatives integrades a Paper Book. Està redactat perquè [Nom de la teva Organització] el faci servir com a referència en la seva pròpia avaluació de riscos de seguretat, inclosa, quan correspongui, una autoavaluació de l'Esquema Nacional de Seguretat (ENS) o una revisió segons l'article 32 del RGPD/LOPDGDD. Descriu els controls que proporciona la mateixa aplicació; la seguretat de l'allotjament, la xarxa i les còpies de seguretat continuen sent responsabilitat de qui operi aquesta instància (vegeu l'apartat 6)."
    },
    {type: "heading", text: "1. Autenticació i gestió de sessions"},
    {
        type: "list",
        items: [
            "Les contrasenyes es xifren amb bcrypt (factor de cost 12); l'aplicació mai emmagatzema ni registra una contrasenya en text pla.",
            "Els tokens de sessió són JSON Web Tokens signats, restringits a l'algorisme HS256, transportats en una cookie httpOnly, Secure i SameSite=Strict que els scripts de la pàgina mai poden llegir.",
            "Canviar una contrasenya revoca immediatament qualsevol altre token de sessió ja emès per a aquest compte, inclòs un de robat.",
            "L'inici de sessió i el registre estan limitats per adreça IP per dificultar els atacs de força bruta i de farciment de credencials."
        ]
    },
    {type: "heading", text: "2. Protecció i minimització de dades"},
    {
        type: "list",
        items: [
            "Totes les consultes a la base de dades fan servir sentències parametritzades; les dades introduïdes per l'usuari mai es concatenen al text SQL.",
            "Els registres de prestataris només emmagatzemen un nom i, opcionalment, un grup: l'aplicació no recull dades de contacte, números d'identificació ni dates de naixement.",
            "Els comptes marcats com a institució pública reben un avís dins de la mateixa aplicació per fer servir codis o identificadors en lloc de noms complets quan el grup gestionat inclogui menors o altres persones especialment vulnerables.",
            "Eliminar un registre l'esborra de manera permanent de la base de dades; no hi ha cap indicador d'esborrat lògic que en deixi una còpia residual."
        ]
    },
    {type: "heading", text: "3. Control d'accés"},
    {
        type: "list",
        items: [
            "El catàleg, els prestataris i la configuració de cada compte estan aïllats de la resta de comptes a nivell de base de dades.",
            "La pujada de fitxers (portades de llibres, fotos de perfil) està restringida a PNG/JPEG i a una mida màxima fixa.",
            "Qualsevol sol·licitud que modifiqui dades requereix una sessió autenticada vàlida i no caducada."
        ]
    },
    {type: "heading", text: "4. Seguretat de xarxa i transport"},
    {
        type: "list",
        items: [
            "L'intercanvi de recursos entre orígens (CORS) està restringit a l'únic origen configurat per a l'aplicació, mai a un comodí.",
            "S'aplica una Política de Seguretat de Continguts (CSP) i capçaleres de seguretat estàndard a cada resposta.",
            "El xifratge del trànsit en trànsit (HTTPS/TLS) el configura qui opera la instància, a nivell de proxy invers o túnel; consulta la guia de desplegament."
        ]
    },
    {type: "heading", text: "5. Manteniment continu"},
    {
        type: "list",
        items: [
            "Les dependències es mantenen actualitzades i es revisen a la recerca de vulnerabilitats conegudes abans de cada versió.",
            "Els problemes de seguretat es poden reportar de manera privada en lloc de com un issue públic; consulta SECURITY.md al repositori del projecte."
        ]
    },
    {type: "heading", text: "6. Allò que continua sent responsabilitat de qui opera la instància"},
    {
        type: "paragraph",
        text: "Paper Book és programari autoallotjat, no un servei gestionat. [Nom de la teva Organització] és el responsable del tractament de qualsevol dada personal introduïda en aquesta instància i és responsable de: la terminació TLS/HTTPS, la seguretat del servidor i la xarxa, les còpies de seguretat de la base de dades i el seu xifratge, els terminis de conservació i eliminació de dades, i qualsevol obligació sectorial que li sigui aplicable, inclosos el RGPD/LOPDGDD i, en el cas d'organismes del sector públic espanyol, l'Esquema Nacional de Seguretat (Reial Decret 311/2022)."
    },
    {
        type: "paragraph",
        text: "Aquest resum descriu els controls integrats a l'aplicació i no constitueix, per si mateix, una certificació de compliment de cap estàndard concret."
    },
];
