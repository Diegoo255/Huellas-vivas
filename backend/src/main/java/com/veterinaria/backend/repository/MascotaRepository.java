package com.veterinaria.backend.repository;

import com.veterinaria.backend.model.Mascota;
import com.veterinaria.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Integer> {
    
    // Busca mascotas por su nombre (parcial o completo).
    // (Puedes comentar o eliminar este si solo usas el método de abajo)
    List<Mascota> findByNombreContainingIgnoreCase(String nombre); 
    
    // Busca todas las mascotas que pertenecen a un cliente específico, usando el ID del cliente.
    List<Mascota> findByCliente(Cliente cliente);
    
    // Busca mascotas por nombre y que pertenezcan a un cliente específico.
    List<Mascota> findByNombreContainingIgnoreCaseAndCliente(String nombre, Cliente cliente);

    // Método POTENTE para la búsqueda general (Nombre O Especie O Raza)
    List<Mascota> findByNombreContainingIgnoreCaseOrEspecieContainingIgnoreCaseOrRazaContainingIgnoreCase(String nombre, String especie, String raza);

}