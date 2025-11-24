package com.veterinaria.backend.service; // Asegúrate de que el paquete sea correcto

import com.veterinaria.backend.model.Empleado;
import com.veterinaria.backend.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EmpleadoDetailsService implements UserDetailsService {

    // Inyecta tu repositorio para buscar al Empleado en la DB
    @Autowired
    private EmpleadoRepository empleadoRepository;

    /**
     * Este método es llamado automáticamente por Spring Security 
     * cuando un usuario intenta iniciar sesión.
     * * @param username El nombre de usuario (el campo 'username' del formulario de login).
     * @return UserDetails (Objeto que Spring Security usa para verificar la contraseña y roles).
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // 1. Buscar al Empleado por su campo 'username'
        Empleado empleado = empleadoRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
            
        // 2. Convertir los Roles del Empleado a GrantedAuthority (formato que Spring Security entiende)
        // Usamos el nombre del rol (ej: "ADMINISTRADOR", "RECEPCIONISTA")
        Set<GrantedAuthority> authorities = empleado.getRoles().stream()
            .map(rol -> new SimpleGrantedAuthority(rol.getNombre())) // Suponiendo que 'nombre' es un Enum (TipoRol.java)
            .collect(Collectors.toSet());
            
        // 3. Crear y devolver el objeto UserDetails
        return new User(
            empleado.getUsername(),      // El nombre de usuario
            empleado.getPassword(),      // La contraseña hasheada (BCrypt)
            authorities                  // Los roles/permisos
        );
    }
}