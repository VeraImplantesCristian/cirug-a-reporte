// src/utils/clipboard.js

// Función para copiar contenido HTML y texto plano al portapapeles.
export async function copyHtmlToClipboard(html, text) {
  // Verificamos si el navegador soporta la API ClipboardItem.
  if (!navigator.clipboard || !navigator.clipboard.write) {
    // Si no lo soporta, intentamos copiar solo el texto plano como fallback.
    await navigator.clipboard.writeText(text);
    console.warn('ClipboardItem API no soportada, se copió solo texto plano.');
    return;
  }

  try {
    const htmlBlob = new Blob([html], { type: 'text/html' });
    const textBlob = new Blob([text], { type: 'text/plain' });

    // Creamos un objeto ClipboardItem con ambos tipos de contenido.
    const clipboardItem = new ClipboardItem({
      'text/html': htmlBlob,
      'text/plain': textBlob
    });

    // Escribimos el ClipboardItem al portapapeles.
    await navigator.clipboard.write([clipboardItem]);
  } catch (error) {
    console.error('Error al copiar al portapapeles (HTML/texto):', error);
    // Si falla, intentamos copiar solo el texto plano como fallback final.
    await navigator.clipboard.writeText(text);
    console.warn('Fallo al copiar HTML, se copió solo texto plano como fallback.');
    throw error; // Relanzamos el error para que el componente lo maneje.
  }
}