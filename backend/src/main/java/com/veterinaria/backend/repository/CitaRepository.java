package com.veterinaria.backend.repository;

import com.veterinaria.backend.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {
    // Aquí puedes agregar métodos de búsqueda personalizados si son necesarios
}