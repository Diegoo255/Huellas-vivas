package com.veterinaria.backend.controller;

import com.veterinaria.backend.model.Empleado;
import com.veterinaria.backend.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/empleados")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5500","*" }, methods = { RequestMethod.GET,
        RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE, RequestMethod.OPTIONS })
public class EmpleadoController {

    @Autowired
    private EmpleadoService empleadoService;

    // CREATE (POST /api/empleados) ahora usa crearNuevoEmpleado
    @PostMapping
    public ResponseEntity<Empleado> crearEmpleado(@RequestBody Empleado empleado) {
        try {
            Empleado nuevoEmpleado = empleadoService.crearNuevoEmpleado(empleado);
            return new ResponseEntity<>(nuevoEmpleado, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Maneja error de negocio (ej. Rol no encontrado, campo obligatorio)
            return ResponseEntity.badRequest().build(); 
        }
    }

    // READ (GET /api/empleados o /api/empleados?termino=...)
    @GetMapping
    public List<Empleado> obtenerEmpleados(
            @RequestParam(required = false, name = "termino") String termino) {
        return empleadoService.buscarEmpleados(termino);
    }

    // READ by ID (GET /api/empleados/{id})
    @GetMapping("/{id}")
    public ResponseEntity<Empleado> obtenerEmpleadoPorId(@PathVariable Integer id) {
        Optional<Empleado> empleado = empleadoService.obtenerEmpleadoPorId(id);
        return empleado.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // UPDATE (PUT /api/empleados/{id}) ahora usa actualizarEmpleado
    @PutMapping("/{id}")
    public ResponseEntity<Empleado> actualizarEmpleado(@PathVariable Integer id, @RequestBody Empleado empleadoDetalles) {
        try {
            Optional<Empleado> empleadoActualizado = empleadoService.actualizarEmpleado(id, empleadoDetalles);
            
            return empleadoActualizado.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            // Maneja errores de negocio durante la actualización
            return ResponseEntity.badRequest().build(); 
        }
    }

    // DELETE (DELETE /api/empleados/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEmpleado(@PathVariable Integer id) {
        empleadoService.eliminarEmpleado(id);
        return ResponseEntity.noContent().build();
    }
}