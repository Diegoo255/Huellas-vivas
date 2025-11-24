package com.veterinaria.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
@Configuration
@EnableWebSecurity
class SecurityConfig {

    // 1. CONFIGURACIÓN DEL CIFRADO DE CONTRASEÑAS (PasswordEncoder)
    // Este Bean es lo que la clase EmpleadoService está buscando.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. CONFIGURACIÓN CORS (Para que el frontend pueda hablar con el backend)
    // Reemplaza la anotación @CrossOrigin en los controladores.
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Aplica a todas las rutas (incluyendo /api)
                        .allowedOrigins(
                                "http://localhost:5500",
                                "http://127.0.0.1:5500",
                                "http://localhost:5501",
                                "http://127.0.0.1:5501")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
public WebSecurityCustomizer webSecurityCustomizer() {
    // Esto EXCLUYE completamente las rutas estáticas del filtro de seguridad de Spring.
    // Usamos atCommonLocations() para cubrir /static, /css, /js, /images, etc.
    return (web) -> web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
}



    // 3. CONFIGURACIÓN DE REGLAS DE ACCESO (PROTECCIÓN DE RUTAS)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF

                .authorizeHttpRequests(authorize -> authorize
                        // 1. RUTAS PÚBLICAS: Login y recursos estáticos
                        .requestMatchers(
                                "/",
                                "/login.html", "/login",

                                "/*.css", "/*.js",
                                "/*.png", "/*.jpg",
                                "/images/**", "/css/**", "/js/**")
                        .permitAll()

                        

                        // 2. RUTAS PROTEGIDAS: Todo lo demás requiere autenticación.
                        .anyRequest().authenticated())

                // 3. CONFIGURACIÓN DEL FORMULARIO DE LOGIN
                .formLogin(form -> form
                        .loginPage("/login.html")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/indexmod.html", true)
                        .failureUrl("/login.html?error=true")
                        .permitAll())

                // 4. CONFIGURACIÓN DEL CIERRE DE SESIÓN
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login.html?logout=true")
                        .permitAll());

        return http.build();
    }
}