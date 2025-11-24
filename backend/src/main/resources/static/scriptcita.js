const URL_API_CITAS = "/api/citas";
const ID_BODY_TABLA = 'cuerpoTablaCitas';
// La URL para crear/editar citas se manejará en NuevaCita.html, por ahora solo necesitamos la tabla.

// --- FUNCIÓN UTILITARIA: Formateo de Fecha y Hora ----------------------

/**
 * Formatea el string ISO de fecha/hora a un formato legible en español.
 * @param {string} isoString - Fecha en formato ISO.
 * @returns {string} Fecha y hora formateada.
 */
const formatFechaHora = (isoString) => {
    if (!isoString) return 'Fecha Inválida';
    const date = new Date(isoString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    };
    return date.toLocaleString('es-MX', options);
};


// --- FUNCIÓN CRUD: DELETE (Eliminar Cita) --------------------------------

/**
 * Pide confirmación y elimina una cita.
 * @param {number} id - ID de la cita a eliminar.
 */
async function eliminarCita(id) {
    // Usamos window.confirm() según tu script de ejemplo.
    if (!confirm(`¿Estás seguro de que deseas eliminar la Cita con ID: ${id}? Esta acción es irreversible.`)) { 
        return; 
    }
    
    try {
        const respuesta = await fetch(`${URL_API_CITAS}/${id}`, { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' } 
        });
        
        // El DELETE exitoso devuelve un código 204 No Content
        if (respuesta.ok || respuesta.status === 204) {
            alert(`Cita con ID ${id} eliminada con éxito.`);
            cargarCitas(); // Recargar la tabla
        } else {
            // Intenta leer el cuerpo del error si existe
            const errorInfo = await respuesta.json().catch(() => ({ message: respuesta.statusText || 'Error desconocido' }));
            alert(`Error al eliminar la cita: ${errorInfo.message}`);
        }

    } catch (error) {
        console.error('Error de conexión al intentar eliminar:', error);
        alert('ERROR: No se pudo conectar con el servidor para eliminar el registro.');
    }
}


// --- FUNCIÓN CRUD: READ (Cargar y Búsqueda de Citas) ----------------------

/**
 * Carga todas las citas desde la API y las muestra en la tabla.
 * @param {string} terminoBusqueda - Término para filtrar en el lado del cliente (por Mascota o Veterinario).
 */
async function cargarCitas(terminoBusqueda = '') {
    const tablaBody = document.getElementById(ID_BODY_TABLA);
    if (!tablaBody) return;

    tablaBody.innerHTML = '<tr><td colspan="7">Cargando citas...</td></tr>';
    
    // Por ahora, la búsqueda se hace en el frontend (client-side filter)
    // Ya que el backend de Citas no tiene un endpoint de búsqueda implementado (solo el de Empleados lo tiene)
    const termino = terminoBusqueda.toLowerCase().trim();

    try {
        const respuesta = await fetch(URL_API_CITAS);
        if (!respuesta.ok) { 
            throw new Error(`Error HTTP: ${respuesta.status}`); 
        }
        
        let citas = await respuesta.json();

        // 1. Filtrar en el cliente si hay término de búsqueda
        if (termino) {
            citas = citas.filter(cita => {
                const veterinario = (cita.nombreVeterinario || '').toLowerCase();
                const mascota = (cita.nombreMascota || '').toLowerCase();
                return veterinario.includes(termino) || mascota.includes(termino);
            });
        }

        // 2. Renderizar resultados
        tablaBody.innerHTML = '';
        if (citas.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="7">No hay citas registradas ${termino ? 'que coincidan con la búsqueda.' : ''}</td></tr>`;
            return;
        }

        citas.forEach(cita => {
            const fila = tablaBody.insertRow();
            
            // Columna 1: ID
            fila.insertCell().textContent = cita.idCita;
            
            // Columna 2: Fecha y Hora
            fila.insertCell().textContent = formatFechaHora(cita.fechaHora);
            
            // Columna 3: Mascota (nombreMascota lo crea el modelo Java)
            fila.insertCell().textContent = cita.nombreMascota || 'N/A';
            
            // Columna 4: Veterinario (nombreVeterinario lo crea el modelo Java)
            fila.insertCell().textContent = cita.nombreVeterinario || 'N/A';
            
            // Columna 5: Motivo
            fila.insertCell().textContent = cita.motivo;

            // Columna 6: Estado
            const estadoCell = fila.insertCell();
            estadoCell.textContent = cita.estado;
            // Opcional: añadir clase CSS para estilizar el estado
            estadoCell.className = `estado-${cita.estado.toLowerCase()}`;

            // Columna 7: Acciones (Editar/Eliminar)
            const celdaAcciones = fila.insertCell();
            celdaAcciones.className = 'acciones'; // Clase para estilos de botones
            
            // Botón/Link de Editar
            celdaAcciones.innerHTML = `
                <a href="EditarCita.html?id=${cita.idCita}" 
                class="btn-accion btn-editar" data-id="${cita.idCita}"> 
                Editar
                <i class="fa-solid fa-pen-to-square"></i>
                </a>
                <button class="btn-accion btn-eliminar" data-id="${cita.idCita}">
                Eliminar <i class="fa-solid fa-trash-can"></i></button>
            `;
        });

    } catch (error) {
        console.error('Error al obtener citas:', error);
        tablaBody.innerHTML = `<tr><td colspan="7" style="color: red;">Error al conectar con la API de Citas: ${error.message}. ¿El backend está activo?</td></tr>`;
    }
}


// --- LÓGICA DE INICIALIZACIÓN Y EVENTOS GENERALES ----------------------
document.addEventListener('DOMContentLoaded', function () {
    
    // LÓGICA DE LA TABLA (TablaCitaD.html)
    const tablaBody = document.getElementById(ID_BODY_TABLA);
    const btnBuscar = document.getElementById('btnBuscar'); // Asumiendo ID 'btnBuscar'
    const inputBusqueda = document.getElementById('busquedaCita'); // Asumiendo ID 'busquedaCita'

    // Manejo de la búsqueda
    if (btnBuscar && inputBusqueda) {
        const ejecutarBusqueda = () => {
             const termino = inputBusqueda.value.trim();
             cargarCitas(termino);
        };

        btnBuscar.addEventListener('click', ejecutarBusqueda);

        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                ejecutarBusqueda();
            }
        });
    }

    // Cargar la tabla al iniciar
    if (tablaBody) {
        cargarCitas();
        
        // Manejo de eventos en los botones de la tabla (Eliminar)
        tablaBody.addEventListener('click', (event) => {
            const target = event.target.closest('.btn-eliminar'); // Busca el botón de eliminar
            
            if (target) {
                const citaId = target.getAttribute('data-id');
                if (citaId) {
                    eliminarCita(citaId);
                }
            }
            
            // NOTA: El botón/link de Editar ya redirige directamente con su href
        });
    }
});