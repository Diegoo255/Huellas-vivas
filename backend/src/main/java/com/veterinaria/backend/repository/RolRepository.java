// Archivo: RolRepository.java

package com.veterinaria.backend.repository;

import com.veterinaria.backend.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Integer> {
    
    // Método necesario para buscar un rol por su nombre (ej. "RECEPCIONISTA")
    Optional<Rol> findByNombre(String nombre); 
}