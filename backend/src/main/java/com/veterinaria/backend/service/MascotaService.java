package com.veterinaria.backend.service;

import com.veterinaria.backend.model.Mascota;
import com.veterinaria.backend.model.Cliente;
import com.veterinaria.backend.repository.MascotaRepository;
import com.veterinaria.backend.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MascotaService {

    @Autowired
    private MascotaRepository mascotaRepository;
    
    @Autowired
    private ClienteRepository clienteRepository;

    public Mascota guardarMascota(Mascota mascota) {
        return mascotaRepository.save(mascota);
    }
    
    public Optional<Mascota> obtenerMascotaPorId(Integer id) {
        return mascotaRepository.findById(id);
    }

    public void eliminarMascota(Integer id) {
        mascotaRepository.deleteById(id);
    }

    /**
     * Busca mascotas por su nombre (parcial) o filtra todas las mascotas de un cliente.
     * @param termino El término de búsqueda (nombre, especie, raza) o nulo.
     * @param clienteId Si se proporciona, la búsqueda se limita a este cliente.
     */
     public List<Mascota> buscarMascotas(String termino, Optional<Integer> clienteId) {
        
        // El término está presente y no hay filtro por cliente (BÚSQUEDA GENERAL)
        if (clienteId.isEmpty() && (termino != null && !termino.trim().isEmpty())) {
            // *** ESTE ES EL CAMBIO CLAVE ***
            // Usamos el método de 3 campos para que el término busque en Nombre, Especie o Raza.
            String t = termino.trim();
            return mascotaRepository.findByNombreContainingIgnoreCaseOrEspecieContainingIgnoreCaseOrRazaContainingIgnoreCase(t, t, t);
        } 
        
        // 2. Caso: Filtrar/Buscar dentro de un cliente específico
        if (clienteId.isPresent()) {
            Optional<Cliente> clienteOptional = clienteRepository.findById(clienteId.get());
            
            if (clienteOptional.isPresent()) {
                Cliente cliente = clienteOptional.get();
                
                if (termino == null || termino.trim().isEmpty()) {
                    // Si solo hay clienteId: trae todas las mascotas de ese cliente.
                    return mascotaRepository.findByCliente(cliente);
                } else {
                    // Si hay clienteId y término: busca por nombre dentro de ese cliente.
                    return mascotaRepository.findByNombreContainingIgnoreCaseAndCliente(termino.trim(), cliente);
                }
            }
            // ClienteId presente, pero Cliente no encontrado: devuelve lista vacía.
            return List.of(); 
        } 
        
        // 3. Caso: No hay clienteId y no hay término (Lista inicial): trae todas las mascotas.
        return mascotaRepository.findAll();
    }
}