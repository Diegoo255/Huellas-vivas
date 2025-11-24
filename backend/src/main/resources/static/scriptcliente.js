const URL_BASE = "/api/clientes";

document.addEventListener("DOMContentLoaded", () => {
    cargarClientes();

    const formulario = document.getElementById("formularioCliente");
    if (formulario) {
        formulario.addEventListener("submit", guardarCliente);

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (id) {
            document.getElementById("idClienteHidden").value = id;
            cargarClientePorId(id);
        }
    }
});

/* ----------------------------------------------------
   GUARDAR (Crear o Editar)
---------------------------------------------------- */

async function guardarCliente(event) {
    event.preventDefault();

    const id = document.getElementById("idClienteHidden")?.value || null;

    const datosCliente = {
        nombre: document.getElementById("usuarioN").value,
        apellido: document.getElementById("usuarioA").value,
        telefono: document.getElementById("numero").value,
        direccion: document.getElementById("Dirreccion").value,
        email: document.getElementById("correo").value
    };

    let url = URL_BASE;
    let method = "POST";
    let mensaje = "registrado";

    if (id) {
        method = "PUT";
        url = `${URL_BASE}/${id}`;
        mensaje = "actualizado";
        datosCliente.id_cliente = id;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosCliente)
        });

        if (!response.ok) throw new Error("Error al guardar el cliente");

        alert(`Cliente ${datosCliente.nombre} ${mensaje} con éxito.`);
        window.location.href = "TablaclienteD.html";

    } catch (error) {
        console.error(error);
        alert("Error: no se pudo guardar el cliente.");
    }
}

/* ----------------------------------------------------
   CARGAR 1 CLIENTE (para edición)
---------------------------------------------------- */

async function cargarClientePorId(id) {
    try {
        const response = await fetch(`${URL_BASE}/${id}`);
        if (!response.ok) throw new Error("No se pudo cargar el cliente");

        const cliente = await response.json();

        document.getElementById("usuarioN").value = cliente.nombre || "";
        document.getElementById("usuarioA").value = cliente.apellido || "";
        document.getElementById("numero").value = cliente.telefono || "";
        document.getElementById("Dirreccion").value = cliente.direccion || "";
        document.getElementById("correo").value = cliente.email || "";

        document.getElementById("tituloFormulario").innerText = `Editar Cliente (ID: ${id})`;

    } catch (error) {
        console.error(error);
        alert("Error cargando cliente.");
    }
}

/* ----------------------------------------------------
   LISTADO DE CLIENTES
---------------------------------------------------- */

async function cargarClientes(termino = "") {
    const tbody = document.getElementById("cuerpoTablaClientes");
    if (!tbody) return;

    let url = URL_BASE;
    if (termino.trim() !== "") url += `?q=${encodeURIComponent(termino)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al obtener clientes");

        const clientes = await response.json();
        tbody.innerHTML = "";

        if (clientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7">No hay clientes registrados.</td></tr>`;
            return;
        }

        clientes.forEach(c => {
            const fila = `
                <tr>
                    <td>${c.id_cliente}</td>
                    <td>${c.nombre}</td>
                    <td>${c.apellido}</td>
                    <td>${c.telefono}</td>
                    <td>${c.direccion}</td>
                    <td>${c.email}</td>
                    <td>
                        <button class="btn-accion btn-editar" data-id="${c.id_cliente}">
                            Editar <i class="fa-solid fa-pen-to-square"></i>
                        </button>
            
                        <button class="btn-accion btn-eliminar" data-id="${c.id_cliente}">
                            Eliminar <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", fila);
        });

        agregarEventosTabla();

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="7">Error al cargar datos del servidor.</td></tr>`;
    }
}

/* ----------------------------------------------------
   EVENTOS EN TABLA
---------------------------------------------------- */

function agregarEventosTabla() {
    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            window.location.href = `Nuevocliente.html?id=${id}`;
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            eliminarCliente(id);
        });
    });
}

/* ----------------------------------------------------
   ELIMINAR CLIENTE
---------------------------------------------------- */

async function eliminarCliente(id) {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;

    try {
        const response = await fetch(`${URL_BASE}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Error al eliminar");

        alert("Cliente eliminado con éxito.");
        cargarClientes();

    } catch (error) {
        console.error(error);
        alert("Error al eliminar cliente.");
    }
}
