/** Traducción al español del resumen de Medidas de Seguridad, renderizado por LegalContent.vue. Solo datos de contenido, editado por legal/producto, no lógica de la app. */
import {LegalBlock} from "@/views/legal/legalTypes";

export const securityMeasuresEs: LegalBlock[] = [
    {type: "paragraph", text: "Última actualización: 29-08-2026"},
    {
        type: "paragraph",
        text: "Este documento resume las medidas de seguridad técnicas y organizativas integradas en Vaultisse. Está redactado para que [Nombre de tu Organización] lo utilice como referencia en su propia evaluación de riesgos de seguridad, incluida, cuando proceda, una autoevaluación del Esquema Nacional de Seguridad (ENS) o una revisión conforme al artículo 32 del RGPD/LOPDGDD. Describe los controles que proporciona la propia aplicación; la seguridad del alojamiento, la red y las copias de seguridad siguen siendo responsabilidad de quien opere esta instancia (ver apartado 6)."
    },
    {type: "heading", text: "1. Autenticación y gestión de sesiones"},
    {
        type: "list",
        items: [
            "Las contraseñas se cifran con bcrypt (factor de coste 12); la aplicación nunca almacena ni registra una contraseña en texto plano.",
            "Los tokens de sesión son JSON Web Tokens firmados, restringidos al algoritmo HS256, transportados en una cookie httpOnly, Secure y SameSite=Strict que los scripts de la página nunca pueden leer.",
            "Cambiar una contraseña revoca de inmediato cualquier otro token de sesión ya emitido para esa cuenta, incluido uno robado.",
            "El inicio de sesión y el registro están limitados por dirección IP para dificultar los ataques de fuerza bruta y de relleno de credenciales."
        ]
    },
    {type: "heading", text: "2. Protección y minimización de datos"},
    {
        type: "list",
        items: [
            "Todas las consultas a la base de datos usan sentencias parametrizadas; los datos introducidos por el usuario nunca se concatenan en el texto SQL.",
            "Los registros de prestatarios solo almacenan un nombre y, opcionalmente, un grupo: la aplicación no recoge datos de contacto, números de identificación ni fechas de nacimiento.",
            "Las cuentas marcadas como institución pública reciben un aviso dentro de la propia aplicación para usar códigos o identificadores en lugar de nombres completos cuando el grupo gestionado incluya menores u otras personas especialmente vulnerables.",
            "Eliminar un registro lo borra de forma permanente de la base de datos; no existe un indicador de borrado lógico que deje una copia residual."
        ]
    },
    {type: "heading", text: "3. Control de acceso"},
    {
        type: "list",
        items: [
            "El catálogo, los prestatarios y la configuración de cada cuenta están aislados del resto de cuentas a nivel de base de datos.",
            "La subida de archivos (portadas de libros, fotos de perfil) está restringida a PNG/JPEG y a un tamaño máximo fijo.",
            "Toda solicitud que modifique datos requiere una sesión autenticada válida y no caducada."
        ]
    },
    {type: "heading", text: "4. Seguridad de red y transporte"},
    {
        type: "list",
        items: [
            "El intercambio de recursos entre orígenes (CORS) está restringido al único origen configurado para la aplicación, nunca a un comodín.",
            "Se aplica una Política de Seguridad de Contenidos (CSP) y cabeceras de seguridad estándar en cada respuesta.",
            "El cifrado del tráfico en tránsito (HTTPS/TLS) lo configura quien opera la instancia, a nivel de proxy inverso o túnel; consulta la guía de despliegue."
        ]
    },
    {type: "heading", text: "5. Mantenimiento continuo"},
    {
        type: "list",
        items: [
            "Las dependencias se mantienen actualizadas y se revisan en busca de vulnerabilidades conocidas antes de cada versión.",
            "Los problemas de seguridad pueden reportarse de forma privada en lugar de como un issue público; consulta SECURITY.md en el repositorio del proyecto."
        ]
    },
    {type: "heading", text: "6. Lo que sigue siendo responsabilidad de quien opera la instancia"},
    {
        type: "paragraph",
        text: "Vaultisse es software autoalojado, no un servicio gestionado. [Nombre de tu Organización] es el responsable del tratamiento de cualquier dato personal introducido en esta instancia y es responsable de: la terminación TLS/HTTPS, la seguridad del servidor y la red, las copias de seguridad de la base de datos y su cifrado, los plazos de conservación y eliminación de datos, y cualquier obligación sectorial que le sea aplicable, incluidos el RGPD/LOPDGDD y, en el caso de organismos del sector público español, el Esquema Nacional de Seguridad (Real Decreto 311/2022)."
    },
    {
        type: "paragraph",
        text: "Este resumen describe los controles integrados en la aplicación y no constituye, por sí mismo, una certificación de cumplimiento de ningún estándar concreto."
    },
];
