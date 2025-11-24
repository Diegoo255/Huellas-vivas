package com.veterinaria.backend.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "empleados")
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_empleado;

    // Campos necesarios para el LOGIN
    @Column(name = "username", unique = true, length = 100, nullable = false)
    private String username;

    @Column(name = "password", length = 255, nullable = false)
    private String password; // ¡Usaremos Bcrypt para esto!

    @Transient
    private String rolString; // Para asignar el rol desde el formulario

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;

    @Column(name = "telefono", length = 15)
    private String telefono;

    @Column(name = "direccion", length = 255)
    private String direccion;

    @Column(name = "fecha_nacimiento")
    @Temporal(TemporalType.DATE) // Para manejar solo la fecha sin hora
    private Date fechaNacimiento;

    // Relación ManyToMany con Rol
    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "empleado_rol",
        joinColumns = @JoinColumn(name = "empleado_id", referencedColumnName = "id_empleado"),
        inverseJoinColumns = @JoinColumn(name = "rol_id", referencedColumnName = "idRol" )
    )
    private Set<Rol> roles = new HashSet<>();

    // --- Constructores ---
    public Empleado() {}

    // --- Getters y Setters ---

    public Integer getId_empleado() { return id_empleado; }
    public void setId_empleado(Integer id_empleado) { this.id_empleado = id_empleado; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public Date getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(Date fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Set<Rol> getRoles() { return roles; }
    public void setRoles(Set<Rol> roles) { this.roles = roles; }
    

    @JsonProperty("rolString")
    public String getRolString() { 
        if (this.roles == null || this.roles. isEmpty()) {
            return this.rolString != null ? this.rolString : "N/A";
        }
        return this.roles.iterator().next().getNombre(); 
    }
    public void setRolString(String rolString) { this.rolString = rolString; }


}