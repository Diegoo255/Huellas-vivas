package com.veterinaria.backend.controller;

import com.veterinaria.backend.model.Servicio;
import com.veterinaria.backend.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5500","*" }, methods = { RequestMethod.GET,
        RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE, RequestMethod.OPTIONS })
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @PostMapping
    public Servicio crearServicio(@RequestBody Servicio servicio) {
        return servicioService.guardarServicio(servicio);
    }

    @GetMapping
    public List<Servicio> obtenerServicios(
            @RequestParam(required = false, name = "termino") String termino) {
        return servicioService.buscarServicios(termino);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> obtenerServicioPorId(@PathVariable Integer id) {
        Optional<Servicio> servicio = servicioService.obtenerServicioPorId(id);
        return servicio.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Servicio actualizarServicio(@PathVariable Integer id, @RequestBody Servicio servicio) {
        servicio.setId_servicio(id); 
        return servicioService.guardarServicio(servicio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Integer id) {
        servicioService.eliminarServicio(id);
        return ResponseEntity.noContent().build();
    }
}