package com.veterinaria.backend.controller;

import com.veterinaria.backend.model.Cita;
import com.veterinaria.backend.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5500","*" }, methods = { RequestMethod.GET,
        RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })
public class CitaController {

    @Autowired
    private CitaService citaService;

    // CREATE
    @PostMapping
    public ResponseEntity<Cita> crearCita(@RequestBody Cita cita) {
        try {
            Cita nuevaCita = citaService.guardarCita(cita);
            return new ResponseEntity<>(nuevaCita, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Manejar errores de negocio (Ej: Mascota/Empleado no encontrado)
            System.err.println("Error al crear cita: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // READ ALL
    @GetMapping
    public List<Cita> obtenerTodasLasCitas() {
        return citaService.obtenerTodasLasCitas();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Cita> obtenerCitaPorId(@PathVariable Integer id) {
        Optional<Cita> cita = citaService.obtenerCitaPorId(id);
        return cita.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Cita> actualizarCita(@PathVariable Integer id, @RequestBody Cita detallesCita) {
        try {
             Optional<Cita> citaActualizada = citaService.actualizarCita(id, detallesCita);
             
             return citaActualizada.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
             System.err.println("Error al actualizar cita: " + e.getMessage());
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Integer id) {
        citaService.eliminarCita(id);
        return ResponseEntity.noContent().build();
    }
}