const URL_API_MASCOTAS = "/api/mascotas"; 
const ID_BODY_TABLA = 'cuerpoTablaMascotas'; 
const ID_FORMULARIO = 'formularioMascota';
const tablaBody = document.getElementById(ID_BODY_TABLA); 

const RAZAS_POR_ESPECIE = {
    // La llave debe coincidir con el 'value' del select de Especie
    "Perro": ["Labrador", "Pastor Alemán", "Chihuahua", "Poodle", "Pitbull", "Mestizo", "Pug", "Otro"],
    "Gato": ["Siamés", "Persa", "Maine Coon", "Bengalí", "Común Europeo", "Otro"],
    "Roedor": ["Hámster", "Conejillo de Indias", "Conejo", "Rata Doméstica", "Otro"],
    "Ave": ["Canario", "Perico", "Cacatúa", "Cotorro", "Otro"],
    "Otro": ["Desconocida o Exótica"]
    // Añade más especies y razas según sea necesario
};


// ----------------------------------------------------------------------
// --- FUNCIÓN CRUD: CREATE / UPDATE (Guardar Mascota) ------------------
// ----------------------------------------------------------------------

async function guardarMascota(event) {
    event.preventDefault(); 

    // OBTENEMOS LOS VALORES DE LOS CAMPOS USANDO LOS IDs DEL FORMULARIO
    const idMascota = document.getElementById('idMascotaHidden').value;
    const isEditing = !!idMascota; 
    const clienteId = document.getElementById('clienteId').value;
    // Usamos los IDs EXACTOS de tu HTML
    const nombre = document.getElementById('Nombre').value; 
    const especie = document.getElementById('Especie').value; 
    const raza = document.getElementById('Raza').value; 
    const fechaNacimiento = document.getElementById('FechaNacimiento').value; 

    // CREACIÓN DEL JSON QUE SPRING ESPERA
    const mascotaData = {
        ...(isEditing && { id_mascota: parseInt(idMascota) }), 
        // Las llaves JSON deben coincidir con la entidad Mascota.java (nombre, especie, etc.)
        nombre: nombre, 
        especie: especie,
        raza: raza,
        fechaNacimiento: fechaNacimiento, 
        
        // Relación Cliente
        // Spring espera un objeto Cliente con al menos el id_cliente
        cliente: {
            id_cliente: parseInt(clienteId) 
        }
    };
    
    // Configurar la petición
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${URL_API_MASCOTAS}/${idMascota}` : URL_API_MASCOTAS;
    const accion = isEditing ? 'actualizada' : 'guardada';

    try {
        const respuesta = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mascotaData),
        });

        if (respuesta.ok) {
            const result = await respuesta.json();
            // Evitar alert(), usar una notificación suave o modal
            console.log(`Mascota ${result.nombre} ${accion} con éxito.`);
            
            // Redirigir siempre a la tabla después de guardar/editar
            window.location.href = 'TablaMascota.html';
        } else {
            const errorInfo = await respuesta.json().catch(() => ({ message: respuesta.statusText }));
            // Evitar alert(), usar una notificación suave o modal
            console.error(`Error al ${accion} la mascota: ${errorInfo.message}.`);
            alert(`Error al ${accion} la mascota: ${errorInfo.message}.`);
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('ERROR: No se pudo conectar con el servidor.');
    }
}

// ----------------------------------------------------------------------
// --- FUNCIÓN ADICIONAL: CARGAR DATOS PARA EDICIÓN ---------------------
// ----------------------------------------------------------------------

async function cargarDatosMascotaParaEdicion(id) {
    try {
        const respuesta = await fetch(`${URL_API_MASCOTAS}/${id}`);
        if (!respuesta.ok) {
            alert('Mascota no encontrada.');
            return;
        }

        const mascota = await respuesta.json();

        // Precargar los campos del formulario usando los IDs EXACTOS de tu HTML
        document.getElementById('idMascotaHidden').value = mascota.id_mascota; 
        document.getElementById('clienteId').value = mascota.cliente ? mascota.cliente.id_cliente : '';
        document.getElementById('Nombre').value = mascota.nombre;
        document.getElementById('Especie').value = mascota.especie;
        document.getElementById('Raza').value = mascota.raza || '';
        document.getElementById('FechaNacimiento').value = mascota.fechaNacimiento || '';
        
        actualizarRazas(); // Actualiza las opciones de raza según la especie cargada
        // Actualizar el título
        document.querySelector('h2').textContent = 'Editar Mascota: ' + mascota.nombre;

    } catch (error) {
        console.error('Error al cargar datos para edición:', error);
        alert('No se pudieron cargar los datos de la mascota.');
    }
}


// --- FUNCIÓN CRUD: DELETE (Eliminar Mascota) ---
async function eliminarMascota(id) {
    // Usar un modal o confirmación personalizada en lugar de window.confirm
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la Mascota con ID: ${id}? Esta acción es irreversible.`)) { return; }
    try {
        const respuesta = await fetch(`${URL_API_MASCOTAS}/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
        if (respuesta.ok || respuesta.status === 204) {
            alert(`Mascota con ID ${id} eliminada con éxito.`);
            cargarMascotas(); 
        } else {
            const errorInfo = await respuesta.json().catch(() => ({ message: respuesta.statusText }));
            alert(`Error al eliminar la mascota: ${errorInfo.message}`);
        }
    } catch (error) {
        console.error('Error de conexión al intentar eliminar:', error);
        alert('ERROR: No se pudo conectar con el servidor para eliminar el registro.');
    }
}

function actualizarRazas() {
    const selectEspecie = document.getElementById('Especie');
    const selectRaza = document.getElementById('Raza');
    const especieSeleccionada = selectEspecie.value;

    // Limpiar las opciones anteriores
    selectRaza.innerHTML = '<option value="">-- Seleccione una Raza --</option>';

    if (especieSeleccionada && RAZAS_POR_ESPECIE[especieSeleccionada]) {
        // Obtener la lista de razas para la especie
        const razas = RAZAS_POR_ESPECIE[especieSeleccionada];

        // Añadir las nuevas opciones de raza
        razas.forEach(raza => {
            const option = document.createElement('option');
            option.value = raza;
            option.textContent = raza;
            selectRaza.appendChild(option);
        });
    }
}
// --- FUNCIÓN CRUD: READ (Cargar y Búsqueda de Mascotas) ---
async function cargarMascotas(terminoBusqueda = '') {
    const tablaBody = document.getElementById(ID_BODY_TABLA);
    if (!tablaBody) return; 
    
    // 1. Mostrar estado de carga
    tablaBody.innerHTML = '<tr><td colspan="8">Cargando mascotas...</td></tr>';
    
    let urlBusqueda = URL_API_MASCOTAS;
    if (terminoBusqueda) {
        // Usa el parámetro 'termino' que configuraste en tu service
        urlBusqueda = `${URL_API_MASCOTAS}?termino=${encodeURIComponent(terminoBusqueda)}`; 
    }

    try {
        const respuesta = await fetch(urlBusqueda);
        
        if (!respuesta.ok) { 
            throw new Error(`Error HTTP: ${respuesta.status}. Mensaje: ${respuesta.statusText}`); 
        }

        const mascotas = await respuesta.json();
        tablaBody.innerHTML = ''; // Limpiar después de obtener los datos

        if (mascotas.length === 0) {
             tablaBody.innerHTML = `<tr><td colspan="8">No hay mascotas registradas ${terminoBusqueda ? 'que coincidan con la búsqueda.' : ''}</td></tr>`;
             return;
        }

        mascotas.forEach(mascota => {
            const fila = tablaBody.insertRow();
            fila.insertCell().textContent = mascota.id_mascota; 
            fila.insertCell().textContent = mascota.nombre;
            fila.insertCell().textContent = mascota.especie;
            fila.insertCell().textContent = mascota.raza || 'N/A';
            fila.insertCell().textContent = mascota.fechaNacimiento || 'N/A';
            
            // Lógica para mostrar los datos del cliente, asegurando que existen
            const clienteId = mascota.cliente ? mascota.cliente.id_cliente : 'N/A';
            let infoDueno;
            
            // Debido a la configuración de serialización, Mascota solo trae el ID del cliente
            // Si quieres el nombre completo, tendrías que hacer una llamada adicional a la API de Clientes
            // Por ahora, usamos lo que esté disponible:
            if (mascota.cliente) {
                // Si Mascota.java trae el objeto Cliente, lo usamos.
                // Si solo trae el ID (por el corte de serialización), mostramos el ID.
                infoDueno = mascota.cliente.nombre && mascota.cliente.apellido 
                            ? `${mascota.cliente.nombre} ${mascota.cliente.apellido}` 
                            : `ID ${clienteId}`;
            } else {
                infoDueno = 'N/A';
            }

            fila.insertCell().textContent = clienteId; 
            fila.insertCell().textContent = infoDueno;
            
            
            const celdaAcciones = fila.insertCell();
            celdaAcciones.innerHTML = `
                <button class="btn-accion btn-editar" data-id="${mascota.id_mascota}">
                Editar <i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-accion btn-eliminar" data-id="${mascota.id_mascota}">
                Eliminar <i class="fa-solid fa-trash-can"></i></button>
            `;
        });
    } catch (error) {
        console.error('Error al obtener mascotas:', error);
        // Aseguramos que la tabla quede limpia en caso de error
        tablaBody.innerHTML = `<tr><td colspan="8" style="color: red;">Error al conectar con la API: ${error.message}. ¿El backend está activo?</td></tr>`;
    }
}


// ----------------------------------------------------------------------
// --- LÓGICA DE INICIALIZACIÓN Y EVENTOS GENERALES ----------------------
// ----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    
    // LÓGICA DEL FORMULARIO (Nuevamascota.html)
    const formulario = document.getElementById(ID_FORMULARIO);
    if (formulario) {
        formulario.addEventListener('submit', guardarMascota);

        const selectEspecie = document.getElementById('Especie');
        if (selectEspecie) {
            selectEspecie.addEventListener('change', actualizarRazas);
            // Ejecutar si ya hay un valor precargado (caso de edición)
            if (selectEspecie.value) { 
                actualizarRazas(); 
            }
        }
        
        // Verifica si estamos en modo EDICIÓN
        const params = new URLSearchParams(window.location.search);
        const idMascotaEdicion = params.get('id');
        if (idMascotaEdicion) {
            cargarDatosMascotaParaEdicion(idMascotaEdicion);
        }
    }
    
    // LÓGICA DE LA TABLA (TablaMascotaD.html)
    const tablaBody = document.getElementById(ID_BODY_TABLA);
    const btnBuscar = document.getElementById('btnBuscarMascota');
    const inputBusqueda = document.getElementById('busquedaMascota');

    if (btnBuscar && inputBusqueda) {
        btnBuscar.addEventListener('click', () => {
            const termino = inputBusqueda.value.trim();
            cargarMascotas(termino);
        });
        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                btnBuscar.click();
            }
        });
    }
    
    if (tablaBody) {
        // Llama a la función de carga principal al iniciar
        cargarMascotas(); 

        tablaBody.addEventListener('click', (event) => {
            
            // ELIMINAR
            if (event.target.classList.contains('btn-eliminar')) {
                const mascotaId = event.target.getAttribute('data-id');
                if (mascotaId) {
                    eliminarMascota(mascotaId);
                }
            }

            // EDITAR (Redirige al formulario)
            if (event.target.classList.contains('btn-editar')){
                const mascotaId = event.target.getAttribute('data-id'); 
                if (mascotaId) {
                    // La redirección usa 'Nuevamascota.html' y el parámetro 'id'
                    window.location.href = `Nuevamascota.html?id=${mascotaId}`; 
                }
            }
        });
    }
});