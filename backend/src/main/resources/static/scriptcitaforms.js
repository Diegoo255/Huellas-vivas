const URL_API_CITAS = "/api/citas";
const URL_API_MASCOTAS = "/api/mascotas";
const URL_API_EMPLEADOS = "/api/empleados";
const ID_FORMULARIO = 'formularioCita';

// --- FUNCIONES DE SOPORTE: Carga de Dropdowns --------------------------

/**
 * Carga la lista de mascotas y llena el selector correspondiente.
 */
async function cargarMascotas() {
    const selector = document.getElementById('mascotaId');
    selector.innerHTML = '<option value="">Cargando...</option>';
    try {
        const response = await fetch(URL_API_MASCOTAS);
        const mascotas = await response.json();
        
        selector.innerHTML = '<option value="" disabled selected>Selecciona una Mascota</option>';
        mascotas.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id_mascota;
            option.textContent = `${m.nombre} (Cliente: ${m.nombreCliente || 'N/A'})`; // Usamos el nombreCliente del modelo Mascota
            selector.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar mascotas:', error);
        selector.innerHTML = '<option value="">Error al cargar Mascotas</option>';
        alert('Error: No se pudieron cargar las mascotas. Verifica la API de mascotas.');
    }
}

/**
 * Carga la lista de empleados (veterinarios) y llena el selector correspondiente.
 */
async function cargarVeterinarios() {
    const selector = document.getElementById('empleadoId');
    selector.innerHTML = '<option value="">Cargando...</option>';
    try {
        const response = await fetch(URL_API_EMPLEADOS);
        const empleados = await response.json();
        
        selector.innerHTML = '<option value="" disabled selected>Selecciona un Veterinario</option>';
        // Filtramos solo a los empleados que tienen el rol de VETERINARIO (opcional, pero buena práctica)
        const veterinarios = empleados.filter(e => e.rolString && e.rolString.toUpperCase() === 'VETERINARIO');
        
        if (veterinarios.length === 0) {
             selector.innerHTML = '<option value="">No hay Veterinarios disponibles</option>';
             return;
        }

        veterinarios.forEach(e => {
            const option = document.createElement('option');
            option.value = e.id_empleado;
            option.textContent = `${e.nombre} ${e.apellido}`;
            selector.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar empleados:', error);
        selector.innerHTML = '<option value="">Error al cargar Empleados</option>';
        alert('Error: No se pudieron cargar los veterinarios. Verifica la API de empleados.');
    }
}

/**
 * Convierte un objeto Date a formato 'YYYY-MM-DDTHH:MM' (para input datetime-local).
 * @param {Date} date - Objeto Date o string ISO.
 */
const dateToDateTimeLocal = (date) => {
    const d = new Date(date);
    const pad = (num) => (num < 10 ? '0' : '') + num;
    
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hour = pad(d.getHours());
    const minute = pad(d.getMinutes());
    
    return `${year}-${month}-${day}T${hour}:${minute}`;
};

// --- FUNCIÓN CRUD: CREATE / UPDATE (Guardar Cita) ----------------------

async function guardarCita(event) {
    event.preventDefault();
    
    const idCita = document.getElementById('idCitaHidden')?.value || null;
    const isEditing = !!idCita;

    // Obtener valores del formulario
    const fechaHora = document.getElementById('fechaHora').value;
    const mascotaId = document.getElementById('mascotaId').value;
    const empleadoId = document.getElementById('empleadoId').value;
    const motivo = document.getElementById('motivo').value;
    // El estado solo se usa si estamos editando
    const estado = isEditing ? document.getElementById('estado').value : 'PROGRAMADA'; 

    if (!fechaHora || !mascotaId || !empleadoId || !motivo) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // El backend espera la fecha en formato ISO, el input datetime-local lo da.
    const citaData = {
        ...(isEditing && { idCita: parseInt(idCita) }),
        fechaHora: fechaHora + ':00', // Añadir segundos ':00' que el backend espera
        mascotaId: parseInt(mascotaId),
        empleadoId: parseInt(empleadoId),
        motivo: motivo,
        estado: estado
    };

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${URL_API_CITAS}/${idCita}` : URL_API_CITAS;
    const accion = isEditing ? 'actualizada' : 'programada';

    try {
        const respuesta = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(citaData),
        });

        if (respuesta.ok) {
            const result = await respuesta.json();
            alert(`Cita para la Mascota ${result.nombreMascota || 'sin nombre'} ${accion} con éxito.`);
            // Redirigir a la tabla de citas
            window.location.href = 'TablaCitaD.html';
        } else {
            // Manejo de errores 400 (Bad Request) del Service
            const errorText = await respuesta.text();
            alert(`Error al ${accion} la cita: ${errorText}. Código: ${respuesta.status}`);
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('ERROR: No se pudo conectar con el servidor.');
    }
}

// --- FUNCIÓN ADICIONAL: CARGAR DATOS PARA EDICIÓN ---------------------

/**
 * Carga los datos de una cita específica para edición.
 * @param {number} id - ID de la cita a cargar.
 */
async function cargarDatosCitaParaEdicion(id) {
    try {
        const respuesta = await fetch(`${URL_API_CITAS}/${id}`);
        if (!respuesta.ok) {
            alert('Cita no encontrada.');
            return;
        }
        const cita = await respuesta.json();
        
        // 1. Precargar campos básicos
        document.getElementById('idCitaHidden').value = cita.idCita;
        document.getElementById('motivo').value = cita.motivo;
        document.getElementById('tituloFormulario').textContent = 'Editar Cita ID: ' + cita.idCita;

        // 2. Precargar Fecha y Hora (requiere formateo a 'YYYY-MM-DDTHH:MM')
        // El campo cita.fechaHora viene como string ISO.
        document.getElementById('fechaHora').value = dateToDateTimeLocal(cita.fechaHora);

        // 3. Precargar Selectores después de que las listas estén cargadas
        // Usamos setTimeout para asegurar que los <select> se hayan llenado
        setTimeout(() => {
            document.getElementById('mascotaId').value = cita.mascotaId;
            document.getElementById('empleadoId').value = cita.empleadoId;
            document.getElementById('estado').value = cita.estado;
        }, 500); // Pequeña espera para asegurar que las peticiones de lista terminen

        // 4. Mostrar el campo de estado
        document.getElementById('grupoEstado').classList.remove('hidden');

    } catch (error) {
        console.error('Error al cargar datos para edición:', error);
        alert('No se pudieron cargar los datos de la cita para edición.');
    }
}


// --- LÓGICA DE INICIALIZACIÓN Y EVENTOS GENERALES ----------------------
document.addEventListener('DOMContentLoaded', function () {
    
    // 1. Cargar las listas de selección al cargar la página
    cargarMascotas();
    cargarVeterinarios();

    const formulario = document.getElementById(ID_FORMULARIO);
    if (formulario) {
        formulario.addEventListener('submit', guardarCita);
        
        // 2. Revisar si estamos en modo edición
        const params = new URLSearchParams(window.location.search);
        const idCitaEdicion = params.get('id');

        // Si existe un ID en la URL, cargar los datos para edición
        if (idCitaEdicion) {
            cargarDatosCitaParaEdicion(idCitaEdicion);
        } else {
             // Si es una cita nueva, asegurarnos de que el campo de estado esté oculto
             document.getElementById('grupoEstado').classList.add('hidden');
        }
    }
});