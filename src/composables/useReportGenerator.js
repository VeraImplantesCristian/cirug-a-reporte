// src/composables/useReportGenerator.js

import { computed } from 'vue';
import { useFormStore } from '../stores/formStore';
import { useConfigStore } from '../stores/configStore';

const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'N/E'
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
}

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
            EMAIL_CLIENTE: clienteEmail 
        };
        
        // --- 2. Obtención de Mensajes Configurables ---
        const cuerpoReporteInicio = replace(mensajes.cuerpo_reporte_inicio || 'Reporte de Cirugía', variables);
        const cuerpoMaterialReq = replace(mensajes.cuerpo_material_requerido || 'Material Requerido:', variables);
        const msgSaludosFinal = replace(mensajes.msg_saludos_final || 'Saludos cordiales.', variables);
        
        // --- 3. Generación del Bloque de Datos Principales (Usando Plantilla Multilínea) ---
        let estructuraDatos = mensajes.estructura_datos_principales || '';

        // Si el cliente tiene email, lo añadimos a la plantilla de estructura.
        // Esto le da al admin el control de la estructura, pero lo hacemos opcional aquí.
        if (variables.EMAIL_CLIENTE) {
            // Asumimos que la plantilla ya tiene una línea con {EMAIL_CLIENTE} o la añadimos.
            // Para simplificar, asumimos que el admin añade la línea con {EMAIL_CLIENTE} si la quiere.
        }

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

    const generarHTMLReporte = (clienteEmail) => {
        // La generación de HTML es un espejo de la generación de texto plano.
        return `<div style="white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">${generarTextoPlano(clienteEmail)}</div>`;
    };

    return {
        generarTextoPlano,
        generarHTMLReporte,
        formatearFecha
    };
}