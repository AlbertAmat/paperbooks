import {LegalBlock} from "@/views/legal/legalTypes";

export const cookiePolicyEs: LegalBlock[] = [
    {type: "paragraph", text: "Última actualización: 01-01-2026"},
    {
        type: "paragraph",
        text: "Esta Política de Cookies explica qué cookies utiliza Paper Book (la \"Aplicación\") y con qué finalidad, de conformidad con la LSSI-CE (Ley de Servicios de la Sociedad de la Información) y el RGPD."
    },
    {type: "heading", text: "1. ¿Qué es una cookie?"},
    {
        type: "paragraph",
        text: "Una cookie es un pequeño archivo almacenado en tu dispositivo que permite a un sitio web o aplicación reconocer tu navegador entre distintas peticiones."
    },
    {type: "heading", text: "2. Cookies que utilizamos"},
    {type: "paragraph", text: "Paper Book utiliza actualmente solo cookies técnicas o estrictamente necesarias:"},
    {
        type: "table",
        headers: ["Cookie", "Finalidad", "Tipo", "Duración"],
        rows: [
            ["Cookie de sesión", "Mantiene tu sesión iniciada y autentica tus peticiones al servidor", "Estrictamente necesaria", "Sesión / hasta el cierre de sesión"]
        ]
    },
    {
        type: "paragraph",
        text: "Estas cookies no requieren consentimiento previo conforme al artículo 22.2 de la LSSI-CE, ya que son imprescindibles para prestar el servicio que solicitas expresamente al iniciar sesión."
    },
    {type: "heading", text: "3. Cookies que NO utilizamos"},
    {
        type: "paragraph",
        text: "Paper Book no utiliza actualmente cookies de análisis, publicidad o seguimiento de terceros. Si esto cambiara en el futuro, esta política se actualizará y, cuando sea necesario, se solicitará tu consentimiento antes de instalar dichas cookies."
    },
    {type: "heading", text: "4. Gestión de cookies"},
    {
        type: "paragraph",
        text: "Dado que solo se usan cookies estrictamente necesarias, desactivarlas desde la configuración de tu navegador impedirá iniciar sesión o usar la Aplicación. Puedes revisar o eliminar las cookies en cualquier momento desde los ajustes de tu navegador."
    },
    {type: "heading", text: "5. Cambios en esta política"},
    {
        type: "paragraph",
        text: "Podemos actualizar esta Política de Cookies si cambian las cookies utilizadas por la Aplicación. Consulta la fecha de \"Última actualización\" para ver la versión vigente."
    },
    {type: "heading", text: "6. Contacto"},
    {type: "paragraph", text: "Cualquier duda sobre esta Política de Cookies puede enviarse a [privacy@example.com]."}
];
