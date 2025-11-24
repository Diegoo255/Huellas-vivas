const URL_API_EMPLEADOS = "/api/empleados"; 
const ID_BODY_TABLA = 'cuerpoTablaEmpleados'; 
const ID_FORMULARIO = 'formularioEmpleado';

// --- Función Auxiliar para formatear la fecha a YYYY-MM-DD (necesario para input[type="date"])
function formatDateToInput(dateString) {
    if (!dateString) return '';
    // Si la API devuelve un String ISO (YYYY-MM-DDTHH:MM:SS), solo tomamos la parte de la fecha.
    return dateString.split('T')[0];
}

// ----------------------------------------------------------------------
// --- FUNCIÓN CRUD: CREATE / UPDATE (Guardar Empleado) ------------------
// ----------------------------------------------------------------------

async function guardarEmpleado(event) {
    event.preventDefault(); 
    
    // Obtener el ID para saber si es edición (PUT) o creación (POST)
    const idEmpleado = document.getElementById('idEmpleadoHidden')?.value || null;
    const isEditing = !!idEmpleado; 
    
    // OBTENER VALORES USANDO IDs EXACTOS DEL FORMULARIO HTML
    const nombre = document.getElementById('NombreEm').value; 
    const apellido = document.getElementById('ApellidoEm').value; 
    const telefono = document.getElementById('NumeroEm').value; 
    const direccion = document.getElementById('DirreccionEm').value;
    const fechaNacimiento = document.getElementById('FechaNacimientoEm').value; 
    const rolString = document.getElementById('RolEm').value;

    // CREACIÓN DEL JSON (El backend espera "nombre", "apellido", "telefono", etc.)
    const empleadoData = {
        ...(isEditing && { id_empleado: parseInt(idEmpleado) }), 
        nombre: nombre, 
        apellido: apellido,
        telefono: telefono,
        direccion: direccion,
        fechaNacimiento: fechaNacimiento, // La API de Java convierte el string a Date
        rolString: rolString // Nuevo campo para el rol
    };
    
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${URL_API_EMPLEADOS}/${idEmpleado}` : URL_API_EMPLEADOS;
    const accion = isEditing ? 'actualizado' : 'guardado';

    try {
        const respuesta = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(empleadoData),
        });

        if (respuesta.ok) {
            const result = await respuesta.json();
            alert(`Empleado "${result.nombre} ${result.apellido}" ${accion} con éxito.`);
            window.location.href = 'TablaEmpleadoD.html'; // Redirige a la tabla
        } else {
            const errorInfo = await respuesta.json().catch(() => ({ message: respuesta.statusText }));
            alert(`Error al ${accion} el empleado: ${errorInfo.message}.`);
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('ERROR: No se pudo conectar con el servidor.');
    }
}

// ----------------------------------------------------------------------
// --- FUNCIÓN ADICIONAL: CARGAR DATOS PARA EDICIÓN ---------------------
// ----------------------------------------------------------------------

async function cargarDatosEmpleadoParaEdicion(id) {
    try {
        const respuesta = await fetch(`${URL_API_EMPLEADOS}/${id}`);
        if (!respuesta.ok) {
            alert('Empleado no encontrado.');
            return;
        }

        const empleado = await respuesta.json();

        // Precargar los campos (Asegúrate que los IDs de JS coincidan con el HTML)
        document.getElementById('idEmpleadoHidden').value = empleado.id_empleado; 
        document.getElementById('NombreEm').value = empleado.nombre;
        document.getElementById('ApellidoEm').value = empleado.apellido;
        document.getElementById('NumeroEm').value = empleado.telefono || '';
        document.getElementById('DirreccionEm').value = empleado.direccion || '';
        // Formatear la fecha YYYY-MM-DD para el input type="date"
        document.getElementById('FechaNacimientoEm').value = formatDateToInput(empleado.fechaNacimiento);
        document.getElementById('RolEm').value = empleado.rolString || '';
        
        document.querySelector('h2').textContent = 'Editar Empleado: ' + empleado.nombre + ' ' + empleado.apellido;

    } catch (error) {
        console.error('Error al cargar datos para edición:', error);
        alert('No se pudieron cargar los datos del empleado.');
    }
}


// --- FUNCIÓN CRUD: DELETE (Eliminar Empleado) ---
async function eliminarEmpleado(id) {
    if (!confirm(`¿Estás seguro de que deseas eliminar al Empleado con ID: ${id}? Esta acción es irreversible.`)) { return; }
    try {
        const respuesta = await fetch(`${URL_API_EMPLEADOS}/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
        if (respuesta.ok || respuesta.status === 204) {
            alert(`Empleado con ID ${id} eliminado con éxito.`);
            cargarEmpleados(); // Recargar la tabla
        } else {
            const errorInfo = await respuesta.json().catch(() => ({ message: respuesta.statusText }));
            alert(`Error al eliminar el empleado: ${errorInfo.message}`);
        }
    } catch (error) {
        console.error('Error de conexión al intentar eliminar:', error);
        alert('ERROR: No se pudo conectar con el servidor para eliminar el registro.');
    }
}


// --- FUNCIÓN CRUD: READ (Cargar y Búsqueda de Empleados) ---
async function cargarEmpleados(terminoBusqueda = '') {
    const tablaBody = document.getElementById(ID_BODY_TABLA);
    if (!tablaBody) return; 
    
    tablaBody.innerHTML = '<tr><td colspan="7">Cargando empleados...</td></tr>';
    let urlBusqueda = URL_API_EMPLEADOS;
    
    if (terminoBusqueda) {
        urlBusqueda = `${URL_API_EMPLEADOS}?termino=${encodeURIComponent(terminoBusqueda)}`; 
    }

    try {
        const respuesta = await fetch(urlBusqueda);
        if (!respuesta.ok) { throw new Error(`Error HTTP: ${respuesta.status}`); }

        const empleados = await respuesta.json();
        tablaBody.innerHTML = ''; 

        if (empleados.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="7">No hay empleados registrados ${terminoBusqueda ? 'que coincidan con la búsqueda.' : ''}</td></tr>`;
            return;
        }

        empleados.forEach(empleado => {
            const fila = tablaBody.insertRow();
            // 7 columnas: ID, Nombre, Apellido, Teléfono, Dirección, F. Nacimiento, Acciones
            fila.insertCell().textContent = empleado.id_empleado; // Empleado (ID)
            fila.insertCell().textContent = empleado.nombre;
            fila.insertCell().textContent = empleado.apellido;
            fila.insertCell().textContent = empleado.telefono || 'N/A';
            fila.insertCell().textContent = empleado.direccion || 'N/A';
            fila.insertCell().textContent = formatDateToInput(empleado.fechaNacimiento);
            fila.insertCell().textContent = empleado.rolString || 'N/A';
            
            const celdaAcciones = fila.insertCell(); 
            celdaAcciones.innerHTML = `
                <button class="btn-accion btn-editar" data-id="${empleado.id_empleado}">Editar <i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-accion btn-eliminar" data-id="${empleado.id_empleado}">Eliminar <i class="fa-solid fa-trash-can"></i></button>
            `;
        });
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        tablaBody.innerHTML = `<tr><td colspan="7" style="color: red;">Error al conectar con la API: ${error.message}. ¿El backend está activo?</td></tr>`;
    }
}


// ----------------------------------------------------------------------
// --- LÓGICA DE INICIALIZACIÓN Y EVENTOS GENERALES ----------------------
// ----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    
    // LÓGICA DEL FORMULARIO (NuevoEmpleado.html)
    const formulario = document.getElementById(ID_FORMULARIO);
    if (formulario) {
        formulario.addEventListener('submit', guardarEmpleado);
        
        const params = new URLSearchParams(window.location.search);
        const idEmpleadoEdicion = params.get('id');
        if (idEmpleadoEdicion) {
            cargarDatosEmpleadoParaEdicion(idEmpleadoEdicion);
        }
    }
    
    // LÓGICA DE LA TABLA (TablaEmpleadoD.html)
    const tablaBody = document.getElementById(ID_BODY_TABLA);
    const btnBuscar = document.getElementById('btnBuscarEmpleado');
    const inputBusqueda = document.getElementById('busquedaEmpleado');

    if (btnBuscar && inputBusqueda) {
        btnBuscar.addEventListener('click', () => {
            const termino = inputBusqueda.value.trim();
            cargarEmpleados(termino);
        });
        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btnBuscar.click();
            }
        });
    }
    
    if (tablaBody) {
        cargarEmpleados(); 

        tablaBody.addEventListener('click', (event) => {
            
            // ELIMINAR
            if (event.target.classList.contains('btn-eliminar')) {
                const empleadoId = event.target.getAttribute('data-id');
                if (empleadoId) {
                    eliminarEmpleado(empleadoId);
                }
            }

            // EDITAR (Redirige al formulario)
            if (event.target.classList.contains('btn-editar')){
                const empleadoId = event.target.getAttribute('data-id'); 
                if (empleadoId) {
                    window.location.href = `NuevoEmpleado.html?id=${empleadoId}`; 
                }
            }
        });
    }
});