package com.veterinaria.backend.service;

import com.veterinaria.backend.model.Servicio;
import com.veterinaria.backend.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    public Servicio guardarServicio(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    public Optional<Servicio> obtenerServicioPorId(Integer id) {
        return servicioRepository.findById(id);
    }

    public void eliminarServicio(Integer id) {
        servicioRepository.deleteById(id);
    }

    public List<Servicio> buscarServicios(String termino) {
        if (termino != null && !termino.trim().isEmpty()) {
            return servicioRepository.findByNombreContainingIgnoreCase(termino.trim());
        }
        return servicioRepository.findAll();
    }
}