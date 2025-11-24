package com.veterinaria.backend.service;

import com.veterinaria.backend.model.Empleado;
import com.veterinaria.backend.model.Rol;
import com.veterinaria.backend.repository.EmpleadoRepository;
import com.veterinaria.backend.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RolRepository rolRepository;

    // MÉTODO 1: Para CREAR un empleado (se encarga del username, password y rol)
    @Transactional
    public Empleado crearNuevoEmpleado(Empleado empleado) {
        
        // 1. Generar Username
        String baseUsername = empleado.getNombre().toLowerCase().substring(0, 1)
                + empleado.getApellido().toLowerCase().replaceAll("\\s", "");
        empleado.setUsername(baseUsername);

        // 2. Cifrar Password por defecto
        empleado.setPassword(passwordEncoder.encode("Default12345"));

        // 3. Asignar Rol usando el String recibido del frontend
        String rolNombre = empleado.getRolString(); 


        if (rolNombre == null || rolNombre.isEmpty()) {
            throw new RuntimeException("Error de Negocio: El campo Rol es obligatorio.");
        }

        Optional<Rol> rolOpt = rolRepository.findByNombre(rolNombre);

        if (rolOpt.isPresent()) {
            Set<Rol> roles = new HashSet<>();
            roles.add(rolOpt.get());
            empleado.setRoles(roles); 
        } else {
            throw new RuntimeException("Error de Negocio: El Rol '" + rolNombre + "' no fue encontrado.");             
        }

        return empleadoRepository.save(empleado);
    }

    // MÉTODO 2: Para EDITAR un empleado (actualiza datos personales y rol, PERO NO USERNAME/PASSWORD)
    @Transactional
    public Optional<Empleado> actualizarEmpleado(Integer id, Empleado empleadoDetalles) {
        return empleadoRepository.findById(id)
            .map(empleadoExistente -> {
                // Actualizar campos no sensibles (datos personales)
                empleadoExistente.setNombre(empleadoDetalles.getNombre());
                empleadoExistente.setApellido(empleadoDetalles.getApellido());
                empleadoExistente.setTelefono(empleadoDetalles.getTelefono());
                empleadoExistente.setDireccion(empleadoDetalles.getDireccion());
                empleadoExistente.setFechaNacimiento(empleadoDetalles.getFechaNacimiento());
                
                // Lógica para actualizar el Rol
                String nuevoRolNombre = empleadoDetalles.getRolString();
                if (nuevoRolNombre != null && !nuevoRolNombre.isEmpty()) {
                    Optional<Rol> rolOpt = rolRepository.findByNombre(nuevoRolNombre);
                    if (rolOpt.isPresent()) {
                        Set<Rol> roles = new HashSet<>();
                        roles.add(rolOpt.get());
                        empleadoExistente.setRoles(roles);
                    } else {
                         throw new RuntimeException("Error de Negocio: El Rol '" + nuevoRolNombre + "' no fue encontrado durante la actualización.");
                    }
                }
                // IMPORTANTE: Username y Password NO se modifican aquí.
                return empleadoRepository.save(empleadoExistente);
            });
    }

    public Optional<Empleado> obtenerEmpleadoPorId(Integer id) {
        return empleadoRepository.findById(id);
    }

    public void eliminarEmpleado(Integer id) {
        empleadoRepository.deleteById(id);
    }

    public List<Empleado> buscarEmpleados(String termino) {
        if (termino != null && !termino.trim().isEmpty()) {
            String term = termino.trim();
            return empleadoRepository.findByNombreContainingIgnoreCaseOrApellidoContainingIgnoreCase(term, term);
        }
        return empleadoRepository.findAll();
    }
}