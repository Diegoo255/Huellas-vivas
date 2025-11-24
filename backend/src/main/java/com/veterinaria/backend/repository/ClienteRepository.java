package com.veterinaria.backend.repository;
import com.veterinaria.backend.model.Cliente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// JpaRepository<Modelo, TipoDeId>
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    // Listo. Spring se encarga del resto.

  @Override
  List<Cliente> findAll();
    List<Cliente> findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(String nombre, String apellido);
}