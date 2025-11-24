package com.veterinaria.backend.controller;

import com.veterinaria.backend.model.Cliente;
import com.veterinaria.backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
// Habilitamos CORS explícitamente para todos los métodos CRUD que usamos
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5500","*" }, methods = { RequestMethod.GET,
        RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // POST: Crear Cliente
    @PostMapping
    public Cliente crearCliente(@RequestBody Cliente cliente) {
        return clienteService.guardarCliente(cliente);
    }

    // GET: Obtener Todos O Buscar Clientes
    @GetMapping
    // @RequestParam(required = false) indica que el parámetro 'q' es opcional.
    public List<Cliente> obtenerClientes(@RequestParam(required = false) String q) {

        if (q != null && !q.trim().isEmpty()) {
            return clienteService.buscarClientes(q);
        } else {
            return clienteService.obtenerTodosLosClientes();
        }
    }

    // GET por ID: Necesario para cargar datos de edición
    @GetMapping("/{id}")
    public Optional<Cliente> obtenerClientePorId(@PathVariable Integer id) {
        return clienteService.obtenerClientePorId(id);
    }

    // ACTUALIZAR Cliente (Método para Guardar Cambios)
    @PutMapping("/{id}")
    public Cliente actualizarCliente(@PathVariable Integer id, @RequestBody Cliente cliente) {
        // En Spring Data JPA, si el objeto tiene ID, save() actualiza.
        return clienteService.guardarCliente(cliente);
    }

    // DELETE: Eliminar Cliente
    @DeleteMapping("/{id}")
    public void eliminarCliente(@PathVariable Integer id) {
        clienteService.eliminarCliente(id);
    }
}