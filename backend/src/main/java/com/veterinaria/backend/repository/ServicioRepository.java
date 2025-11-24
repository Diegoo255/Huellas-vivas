package com.veterinaria.backend.repository;

import com.veterinaria.backend.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Integer> {
    
    /**
     * Permite buscar un servicio por nombre (parcial o completo), ignorando mayúsculas/minúsculas.
     */
    List<Servicio> findByNombreContainingIgnoreCase(String nombre);
}