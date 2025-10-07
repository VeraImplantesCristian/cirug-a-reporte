// src/composables/useReportGenerator.js

import { computed } from 'vue';
import { useFormStore } from '../stores/formStore';
import { useConfigStore } from '../stores/configStore';

const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'N/E'
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
}

// Función auxiliar para formatear texto multilínea para HTML
const formatTextForHTML = (text) => text ? text.replace(/\n/g, '<br>') : '<span style="color: #9ca3af; font-style: italic;">No especificado.</span>';


export function useReportGenerator() {
    const formStore = useFormStore();
    const configStore = useConfigStore();

    const generarTextoPlano = (clienteEmail) => {
        const datos = formStore.formState;
        const mensajes = configStore.mensajes;
        const replace = configStore.replaceVariables;
        
        // --- 1. Definición de Variables (para Plantilla) ---
        // Estas claves deben coincidir con los placeholders que el admin puede usar: {CLIENTE}, {FECHA}, etc.
        const variables = { 
            CLIENTE: datos.cliente, 
            PACIENTE: datos.paciente, 
            MEDICO: datos.medico, 
            INSTRUMENTADOR: datos.instrumentador, 
            FECHA: formatearFecha(datos.fecha_cirugia), 
            LUGAR: datos.lugar_cirugia, 
            TIPO_CIRUGIA: datos.tipo_cirugia, 
            EMAIL_CLIENTE: clienteEmail,
            FECHA_ENVIO: formatearFecha(datos.fecha_envio) // Incluimos Fecha de Envío
        };
        
        // --- 2. Obtención de Mensajes Configurables ---
        const cuerpoReporteInicio = replace(mensajes.cuerpo_reporte_inicio || 'Reporte de Cirugía', variables);
        const cuerpoMaterialReq = replace(mensajes.cuerpo_material_requerido || 'Material Requerido:', variables);
        const msgSaludosFinal = replace(mensajes.msg_saludos_final || 'Saludos cordiales.', variables);
        
        // --- 3. Generación del Bloque de Datos Principales (Usando Plantilla Multilínea) ---
        let estructuraDatos = mensajes.estructura_datos_principales || '';

        const bloqueDatosPrincipal = replace(estructuraDatos, variables);

        // --- 4. Construcción Final del Reporte ---
        const materialList = (datos.material || 'N/E')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => `— ${line}`) // Usamos el guion como separador de ítems de material
            .join('\n');
            
        let bloqueAdicional = '';
        if (datos.observaciones) {
            bloqueAdicional += `\n\n⚠︎ Observaciones:\n${datos.observaciones}`;
        }
        if (datos.info_adicional) {
            bloqueAdicional += `\n\nℹ︎ Info Adicional:\n${datos.info_adicional}`;
        }
        
        // El reporte final ensamblado
        return `
📋 ${cuerpoReporteInicio}

${bloqueDatosPrincipal}

\n\n${cuerpoMaterialReq}
${materialList}
${bloqueAdicional}

\n\n${msgSaludosFinal}
        `.trim();
    };

    // --- REIMPLEMENTACIÓN CLAVE DE HTML ENRIQUECIDO ---
    const generarHTMLReporte = (clienteEmail) => {
        const datos = formStore.formState;
        const mensajes = configStore.mensajes;
        
        const fechaCirugiaFormateada = formatearFecha(datos.fecha_cirugia);
        const fechaEnvioFormateada = formatearFecha(datos.fecha_envio);

        // Funcióin auxiliar para añadir una línea de dato a la tabla
        const dataRow = (label, value) => `
            <tr>
                <td style="font-weight: 600; padding: 4px 10px; width: 140px; color: #1f2937;">${label}:</td>
                <td style="padding: 4px 10px; color: #374151;">${value || 'N/E'}</td>
            </tr>
        `;
        
        // 1. Generación de las filas de datos
        // NOTA: El orden y las etiquetas se definen aquí en el HTML para el estilo enriquecido
        const datosPrincipalesHTML = `
            ${dataRow('Paciente', datos.paciente)}
            ${dataRow('Médico', datos.medico)}
            ${dataRow('Instrumentador', datos.instrumentador)}
            ${dataRow('Cliente/ART', datos.cliente)}
            ${datos.email_cliente ? dataRow('Email Cliente', clienteEmail) : ''}
            ${dataRow('Fecha Cirugía', fechaCirugiaFormateada)}
            ${dataRow('Fecha Envío', fechaEnvioFormateada)}
            ${dataRow('Lugar', datos.lugar_cirugia)}
            ${dataRow('Tipo de Cirugía', datos.tipo_cirugia)}
        `;

        // 2. Generación de la lista de material (HTML)
        const materialItems = (datos.material || '')
            .split('\n')
            .filter(l => l.trim() !== '')
            .map(l => `<li style="margin-bottom: 5px;">${l.trim()}</li>`)
            .join('');
            
        const materialListHTML = materialItems ? `<ul style="list-style: disc; margin: 0; padding-left: 20px;">${materialItems}</ul>` : '<p style="color: #9ca3af; font-style: italic;">No especificado.</p>';
        
        // 3. Generación del bloque de observaciones
        const observacionesHTML = datos.observaciones ? `
            <div style="margin-top: 15px; border-top: 1px dashed #e5e7eb; padding-top: 10px;">
                <p style="font-weight: 600; color: #dc2626;">⚠︎ Observaciones:</p>
                <p style="color: #4b5563;">${formatTextForHTML(datos.observaciones)}</p>
            </div>
        ` : '';

        // Generación del HTML final
        return `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
                
                <h2 style="font-size: 20px; font-weight: 700; color: #1f2937; text-align: center; margin-bottom: 15px;">
                    📝 Reporte de Cirugía
                </h2>
                <p style="margin-bottom: 20px; color: #4b5563; text-align: center;">${mensajes.cuerpo_reporte_inicio || 'Estimados, Adjunto detalles de la cirugía programada:'}</p>

                <!-- Bloque de Datos Principales (Tabla) -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; margin-bottom: 20px; background-color: #f9fafb;">
                    ${datosPrincipalesHTML}
                </table>

                <!-- Bloque Material Requerido -->
                <div style="border-bottom: 2px solid #10b981; padding-bottom: 5px; margin-bottom: 10px;">
                    <h3 style="font-size: 16px; font-weight: 700; color: #10b981;">📦 ${mensajes.cuerpo_material_requerido || 'Material Requerido'}</h3>
                </div>
                ${materialListHTML}

                <!-- Observaciones -->
                ${observacionesHTML}
                
                <!-- Cierre -->
                <p style="margin-top: 20px; color: #4b5563;">${mensajes.msg_saludos_final || 'Saludos cordiales.'}</p>
            </div>
        `;
    };

    return {
        generarTextoPlano,
        generarHTMLReporte,
        formatearFecha
    };
}
