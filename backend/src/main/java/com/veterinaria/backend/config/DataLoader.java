package com.veterinaria.backend.config;

import com.veterinaria.backend.model.Rol;
import com.veterinaria.backend.model.Empleado;
import com.veterinaria.backend.repository.RolRepository;
import com.veterinaria.backend.repository.EmpleadoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.HashSet;
import java.util.Set;
import java.util.Optional;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Aseguramos que los roles existan en la DB al iniciar
        crearRolSiNoExiste("ADMINISTRADOR");
        crearRolSiNoExiste("RECEPCIONISTA");
        crearRolSiNoExiste("VETERINARIO");

        crearUsuarioAdminSiNoExiste();

    }

    private void crearRolSiNoExiste(String nombreRol) {
        if (rolRepository.findByNombre(nombreRol).isEmpty()) {
            Rol rol = new Rol();
            rol.setNombre(nombreRol);
            rolRepository.save(rol);
            System.out.println("Rol creado: " + nombreRol);
        }
    }

    private void crearUsuarioAdminSiNoExiste() {
        // Solo creamos el usuario si no hay NINGÚN empleado
        if (empleadoRepository.count() == 0) {

            // Buscar el Rol de Administrador
            Optional<Rol> adminRolOpt = rolRepository.findByNombre("ADMINISTRADOR");

            if (adminRolOpt.isPresent()) {
                Rol adminRol = adminRolOpt.get();
                Set<Rol> roles = new HashSet<>();
                roles.add(adminRol);

                // Crear el empleado
                Empleado admin = new Empleado();
                admin.setUsername("admin"); // <-- USUARIO CLAVE
                admin.setPassword(passwordEncoder.encode("123456")); // <-- CONTRASEÑA CLAVE
                admin.setNombre("Super");
                admin.setApellido("Admin");
                admin.setTelefono("5512345678");
                admin.setDireccion("Oficina Central");
                admin.setRoles(roles); // Asignar el rol

                empleadoRepository.save(admin);
                System.out.println(">>> USUARIO ADMINISTRADOR CREADO: admin / 123456");
            } else {
                System.err.println("!!! ERROR: No se encontró el rol ADMINISTRADOR para crear el usuario inicial.");
            }
        }
    }

}