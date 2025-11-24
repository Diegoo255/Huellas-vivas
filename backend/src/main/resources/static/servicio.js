const URL_API_SERVICIOS = "/api/servicios";
const ID_BODY_TABLA = 'cuerpoTablaServicios';
const ID_FORMULARIO = 'formularioServicio'; // Asumiendo que le darás un ID al form
// --- FUNCIÓN CRUD: CREATE / UPDATE (Guardar Servicio) ------------------

async function guardarServicio(event) {
    event.preventDefault();
    // Asumiendo que añadirás un campo hidden 'idServicioHidden' para edición
    const idServicio = document.getElementById('idServicioHidden')?.value || null;
    const isEditing = !!idServicio;
    // OBTENER VALORES USANDO IDs EXACTOS DEL FORMULARIO HTML
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const costo = document.getElementById('costo').value;
    const duracion = document.getElementById('duracion').value;

    const servicioData = {
        ...(isEditing && { id_servicio: parseInt(idServicio) }),
        nombre: nombre,
        costo: parseFloat(costo), // Convertir a número para el campo BigDecimal
        descripcion: descripcion,
        duracion: duracion,
    };


    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${URL_API_SERVICIOS}/${idServicio}` : URL_API_SERVICIOS;
    const accion = isEditing ? 'actualizado' : 'guardado';



    try {
        const respuesta = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(servicioData),

        });



        if (respuesta.ok) {
            const result = await respuesta.json();
            alert(`Servicio "${result.nombre}" ${accion} con éxito.`);
            // Redirigir a la tabla de servicios
            window.location.href = 'TablaservicioD.html';
        } else {
            const errorInfo = await respuesta.json().catch(() => ({ message: respuesta.statusText }));
            alert(`Error al ${accion} el servicio: ${errorInfo.message}.`);
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('ERROR: No se pudo conectar con el servidor.');
    }
}

// --- FUNCIÓN ADICIONAL: CARGAR DATOS PARA EDICIÓN ---------------------

async function cargarDatosServicioParaEdicion(id) {
    try {
        const respuesta = await fetch(`${URL_API_SERVICIOS}/${id}`);
        if (!respuesta.ok) {
            alert('Servicio no encontrado.');
            return;
        }
        const servicio = await respuesta.json();
        // Precargar los campos
        document.getElementById('idServicioHidden').value = servicio.id_servicio;
        document.getElementById('nombre').value = servicio.nombre;
        document.getElementById('costo').value = servicio.costo;
        document.getElementById('descripcion').value = servicio.descripcion || '';
        document.getElementById('duracion').value = servicio.duracion || ''; // Nuevo campo
        document.querySelector('h2').textContent = 'Editar Servicio: ' + servicio.nombre;

    } catch (error) {
        console.error('Error al cargar datos para edición:', error);
        alert('No se pudieron cargar los datos del servicio.');
    }

}
// --- FUNCIÓN CRUD: DELETE (Eliminar Servicio) ---

async function eliminarServicio(id) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el Servicio con ID: ${id}? Esta acción es irreversible.`)) { return; }
    try {
        const respuesta = await fetch(`${URL_API_SERVICIOS}/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
        if (respuesta.ok || respuesta.status === 204) {
            alert(`Servicio con ID ${id} eliminado con éxito.`);
            cargarServicios();
        } else {
            const errorInfo = await respuesta.json().catch(() => ({ message: respuesta.statusText }));
            alert(`Error al eliminar el servicio: ${errorInfo.message}`);
        }

    } catch (error) {
        console.error('Error de conexión al intentar eliminar:', error);
        alert('ERROR: No se pudo conectar con el servidor para eliminar el registro.');
    }
}


// --- FUNCIÓN CRUD: READ (Cargar y Búsqueda de Servicios) ---

async function cargarServicios(terminoBusqueda = '') {
    const tablaBody = document.getElementById(ID_BODY_TABLA);
    if (!tablaBody) return;

    tablaBody.innerHTML = '<tr><td colspan="5">Cargando servicios...</td></tr>';
    let urlBusqueda = URL_API_SERVICIOS;
    if (terminoBusqueda) {
        urlBusqueda = `${URL_API_SERVICIOS}?termino=${encodeURIComponent(terminoBusqueda)}`;
    }

    try {
        const respuesta = await fetch(urlBusqueda);
        if (!respuesta.ok) { throw new Error(`Error HTTP: ${respuesta.status}`); }
        const servicios = await respuesta.json();
        tablaBody.innerHTML = '';
        if (servicios.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="5">No hay servicios registrados ${terminoBusqueda ? 'que coincidan con la búsqueda.' : ''}</td></tr>`;
            return;
        }

        servicios.forEach(servicio => {
            const fila = tablaBody.insertRow();
            // La tabla tiene: Servicio, Nombre, Descripcion, Costo, Duracion (5 columnas de datos + 1 de acciones = 6)
            fila.insertCell().textContent = servicio.id_servicio; // Columna 'Servicio' (ID)
            fila.insertCell().textContent = servicio.nombre;
            fila.insertCell().textContent = servicio.descripcion || 'N/A';
            fila.insertCell().textContent = `$${servicio.costo.toFixed(2)}`;
            fila.insertCell().textContent = `${servicio.duracion} minutos`; // Nuevo campo

            const celdaAcciones = fila.insertCell(); // Columna extra para acciones
            celdaAcciones.innerHTML = `
                <button class="btn-accion btn-editar" data-id="${servicio.id_servicio}">
                Editar <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-accion btn-eliminar" data-id="${servicio.id_servicio}">
                Eliminar <i class="fa-solid fa-trash-can"></i></button>
            `;

        });

    } catch (error) {
        console.error('Error al obtener servicios:', error);
        tablaBody.innerHTML = `<tr><td colspan="6" style="color: red;">Error al conectar con la API: ${error.message}. ¿El backend está activo?</td></tr>`;
    }

}

// --- LÓGICA DE INICIALIZACIÓN Y EVENTOS GENERALES ----------------------
document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formularioServicio');
    if (formulario) {
        formulario.addEventListener('submit', guardarServicio);
        const params = new URLSearchParams(window.location.search);
        const idServicioEdicion = params.get('id');

        if (idServicioEdicion) {
            cargarDatosServicioParaEdicion(idServicioEdicion);
        }

    }

    // LÓGICA DE LA TABLA (TablaservicioD.html)
    const tablaBody = document.getElementById(ID_BODY_TABLA);
    // Asumiendo que añadirás un campo y un botón de búsqueda en la tabla HTML
    const btnBuscar = document.getElementById('btnBuscarServicio');
    const inputBusqueda = document.getElementById('busquedaServicio');

    if (btnBuscar && inputBusqueda) {
        btnBuscar.addEventListener('click', () => {
            const termino = inputBusqueda.value.trim();
            cargarServicios(termino);
        });

        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btnBuscar.click();
            }

        });

    }



    if (tablaBody) {
        cargarServicios();
        tablaBody.addEventListener('click', (event) => {
            // ELIMINAR

            if (event.target.classList.contains('btn-eliminar')) {
                const servicioId = event.target.getAttribute('data-id');
                if (servicioId) {
                    eliminarServicio(servicioId);
                }
            }


            // EDITAR (Redirige al formulario)
            if (event.target.classList.contains('btn-editar')) {
                const servicioId = event.target.getAttribute('data-id');
                if (servicioId) {
                    window.location.href = `NuevoServicio.html?id=${servicioId}`;
                }
            }
        });
    }
});