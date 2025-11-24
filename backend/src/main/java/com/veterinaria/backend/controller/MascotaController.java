package com.veterinaria.backend.controller;

import com.veterinaria.backend.model.Mascota;
import com.veterinaria.backend.service.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mascotas")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5500","*" }, methods = { RequestMethod.GET,
        RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE, RequestMethod.OPTIONS })
public class MascotaController {

    @Autowired
    private MascotaService mascotaService;

    @PostMapping
    public Mascota crearMascota(@RequestBody Mascota mascota) {
        return mascotaService.guardarMascota(mascota);
    }

    // MÉTODO CONSOLIDADO PARA LISTAR Y BUSCAR (Mapea a /api/mascotas o /api/mascotas?termino=...)
    @GetMapping
    public List<Mascota> obtenerMascotas(
            // Utilizamos 'termino' para que coincida con el frontend y lo hacemos opcional
            @RequestParam(required = false, name = "termino") String termino, 
            @RequestParam(required = false) Optional<Integer> clienteId) { 
        // Llama al servicio con los dos argumentos que espera (el término y el ID opcional del cliente)
        return mascotaService.buscarMascotas(termino, clienteId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mascota> obtenerMascotaPorId(@PathVariable Integer id) {
        Optional<Mascota> mascota = mascotaService.obtenerMascotaPorId(id);

        return mascota.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Mascota actualizarMascota(@PathVariable Integer id, @RequestBody Mascota mascota) {
        mascota.setId_mascota(id);
        return mascotaService.guardarMascota(mascota); 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMascota(@PathVariable Integer id) {
        mascotaService.eliminarMascota(id);
        return ResponseEntity.noContent().build();
    }
}