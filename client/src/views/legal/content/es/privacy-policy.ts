import {LegalBlock} from "@/views/legal/legalTypes";

export const privacyPolicyEs: LegalBlock[] = [
    {type: "paragraph", text: "Última actualización: 01-01-2026"},
    {
        type: "paragraph",
        text: "Esta Política de Privacidad explica cómo [Nombre de tu Organización] (\"nosotros\") trata los datos personales a través de Paper Book (la \"Aplicación\"), de conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)."
    },
    {type: "heading", text: "1. Responsable del tratamiento"},
    {
        type: "list",
        items: [
            "Nombre: [Nombre de tu Organización]",
            "Contacto: [privacy@example.com]",
            "Dirección: [Tu Dirección]"
        ]
    },
    {type: "heading", text: "2. Qué datos tratamos"},
    {type: "paragraph", text: "Paper Book es una herramienta de gestión de biblioteca y préstamos. Según el uso que se haga de ella, podemos tratar:"},
    {
        type: "list",
        items: [
            "Datos de cuenta — nombre, correo electrónico, idioma preferido y contraseña cifrada, de las personas que inician sesión en la Aplicación.",
            "Datos de catálogo — libros, ejemplares, categorías, autores y ubicaciones introducidos por los usuarios de la Aplicación.",
            "Datos de los prestatarios — nombre y datos de contacto de las personas que toman libros en préstamo, introducidos por los usuarios de la Aplicación.",
            "Datos técnicos — dirección IP e identificadores de sesión, generados automáticamente mientras usas la Aplicación."
        ]
    },
    {type: "heading", text: "3. Finalidad y base jurídica"},
    {
        type: "table",
        headers: ["Finalidad", "Base jurídica"],
        rows: [
            ["Prestar y mantener tu cuenta y tu sesión", "Ejecución de un contrato (art. 6.1.b RGPD)"],
            ["Almacenar y gestionar el catálogo y los registros de préstamo que introduces", "Ejecución de un contrato / interés legítimo (art. 6.1.b/f RGPD)"],
            ["Mantener el servicio seguro y prevenir usos indebidos", "Interés legítimo (art. 6.1.f RGPD)"]
        ]
    },
    {type: "heading", text: "4. Conservación de los datos"},
    {
        type: "paragraph",
        text: "Los datos personales se conservan mientras tu cuenta permanezca activa, o durante el tiempo necesario para cumplir las finalidades descritas, salvo que la ley exija un plazo de conservación mayor."
    },
    {type: "heading", text: "5. Comunicación de datos"},
    {
        type: "paragraph",
        text: "No vendemos datos personales. Los datos pueden compartirse con proveedores de alojamiento o infraestructura, estrictamente para operar la Aplicación, bajo los correspondientes contratos de encargo de tratamiento."
    },
    {type: "heading", text: "6. Transferencias internacionales"},
    {
        type: "paragraph",
        text: "[Describe aquí si los datos salen del Espacio Económico Europeo y qué garantías se aplican — p. ej. Cláusulas Contractuales Tipo del Capítulo V del RGPD. Si todos los datos permanecen en el EEE, indícalo en su lugar.]"
    },
    {type: "heading", text: "7. Tus derechos"},
    {
        type: "paragraph",
        text: "De conformidad con el RGPD y la LOPDGDD, puedes ejercer tus derechos de acceso, rectificación, supresión, limitación, portabilidad y oposición escribiendo a [privacy@example.com]. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) o ante la autoridad de control de tu país."
    },
    {type: "heading", text: "8. Seguridad"},
    {
        type: "paragraph",
        text: "Aplicamos medidas técnicas y organizativas razonables para proteger los datos personales frente a accesos no autorizados, pérdida o alteración."
    },
    {type: "heading", text: "9. Cambios en esta política"},
    {
        type: "paragraph",
        text: "Podemos actualizar esta Política de Privacidad periódicamente. Los cambios relevantes se reflejarán actualizando la fecha de \"Última actualización\" indicada arriba."
    },
    {type: "heading", text: "10. Contacto"},
    {type: "paragraph", text: "Para cualquier duda sobre esta política, contacta con nosotros en [privacy@example.com]."}
];
