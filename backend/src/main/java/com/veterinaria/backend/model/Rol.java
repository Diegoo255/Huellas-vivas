// Archivo: Rol.java

package com.veterinaria.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRol;

    // Nombre del rol (ej: ROL_RECEPCIONISTA, ROL_ADMIN)
    @Column(name = "nombre", length = 50, unique = true, nullable = false)
    private String nombre;

    public Rol() {}

    // Getters y Setters
    public Integer getIdRol() { return idRol; }
    public void setIdRol(Integer idRol) { this.idRol = idRol; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}