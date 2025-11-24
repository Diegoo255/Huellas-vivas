package com.veterinaria.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal; 

@Entity
@Table(name = "servicios")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_servicio;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "costo", nullable = false, precision = 10, scale = 2) 
    private BigDecimal costo;

    // Campo basado en tu HTML
    @Column(name = "duracion", nullable = false)
    private Integer duracion;

    // --- Constructores ---
    public Servicio() {}

    // --- Getters y Setters ---

    public Integer getId_servicio() { return id_servicio; }
    public void setId_servicio(Integer id_servicio) { this.id_servicio = id_servicio; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getCosto() { return costo; }
    public void setCosto(BigDecimal costo) { this.costo = costo; }

    // Nuevo Getter y Setter
    public Integer getDuracion() { return duracion; }
    public void setDuracion(Integer duracion) { this.duracion = duracion; }
}