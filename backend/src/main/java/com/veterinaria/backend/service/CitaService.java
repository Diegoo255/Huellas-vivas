package com.veterinaria.backend.service;

import com.veterinaria.backend.model.Cita;
import com.veterinaria.backend.model.Empleado;
import com.veterinaria.backend.model.Mascota;
import com.veterinaria.backend.repository.CitaRepository;
import com.veterinaria.backend.repository.EmpleadoRepository;
import com.veterinaria.backend.repository.MascotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository; 
    
    @Autowired
    private MascotaRepository mascotaRepository;

    // --- Método Auxiliar para validar y asignar relaciones ---
    private void asignarRelaciones(Cita cita) {
        // Asignar Empleado
        Integer empleadoId = cita.getEmpleadoId();
        if (empleadoId == null) {
             throw new RuntimeException("El ID del Empleado es obligatorio para la cita.");
        }
        Optional<Empleado> empleadoOpt = empleadoRepository.findById(empleadoId);
        if (empleadoOpt.isEmpty()) {
            throw new RuntimeException("Empleado con ID " + empleadoId + " no encontrado.");
        }
        cita.setEmpleado(empleadoOpt.get());

        // Asignar Mascota
        Integer mascotaId = cita.getMascotaId();
        if (mascotaId == null) {
            throw new RuntimeException("El ID de la Mascota es obligatorio para la cita.");
        }
        Optional<Mascota> mascotaOpt = mascotaRepository.findById(mascotaId);
        if (mascotaOpt.isEmpty()) {
            throw new RuntimeException("Mascota con ID " + mascotaId + " no encontrada.");
        }
        cita.setMascota(mascotaOpt.get());
    }

    // --- CRUD: CREATE ---
    @Transactional
    public Cita guardarCita(Cita cita) {
        // Aseguramos que la cita tenga Empleado y Mascota
        asignarRelaciones(cita);
        // Por defecto, se crea como "PROGRAMADA" (definido en el modelo)
        return citaRepository.save(cita);
    }

    // --- CRUD: READ ALL ---
    public List<Cita> obtenerTodasLasCitas() {
        return citaRepository.findAll();
    }

    // --- CRUD: READ BY ID ---
    public Optional<Cita> obtenerCitaPorId(Integer id) {
        return citaRepository.findById(id);
    }

    // --- CRUD: UPDATE ---
    @Transactional
    public Optional<Cita> actualizarCita(Integer id, Cita detallesCita) {
        return citaRepository.findById(id)
            .map(citaExistente -> {
                // Actualizar campos principales
                citaExistente.setFechaHora(detallesCita.getFechaHora());
                citaExistente.setMotivo(detallesCita.getMotivo());
                citaExistente.setEstado(detallesCita.getEstado());
                
                // Si el frontend envía IDs, reasignamos las relaciones
                if (detallesCita.getEmpleadoId() != null || detallesCita.getMascotaId() != null) {
                     // Sobreescribimos los IDs transitorios para que la función auxiliar los pueda usar
                     if (detallesCita.getEmpleadoId() != null) citaExistente.setEmpleadoId(detallesCita.getEmpleadoId());
                     if (detallesCita.getMascotaId() != null) citaExistente.setMascotaId(detallesCita.getMascotaId());
                     
                     asignarRelaciones(citaExistente);
                }

                return citaRepository.save(citaExistente);
            });
    }

    // --- CRUD: DELETE ---
    public void eliminarCita(Integer id) {
        citaRepository.deleteById(id);
    }
}