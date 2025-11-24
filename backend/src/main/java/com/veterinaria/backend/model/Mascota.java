package com.veterinaria.backend.model;
import jakarta.persistence.*;
import java.time.LocalDate; // Necesario para la Fecha de Nacimiento
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "mascotas")
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_mascota;

    // Atributos solicitados
    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "especie", nullable = false, length = 50)
    private String especie; // Ejemplo: Perro, Gato, Ave

    @Column(name = "raza", length = 50)
    private String raza;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    // RELACIÓN CON CLIENTE (FOREIGN KEY) 
    // Una Mascota pertenece a UN solo Cliente (ManyToOne)
    // =========================================================
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false) // Esto crea la Foreign Key (FK)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "mascotas"}) // Evita problemas de serialización
    private Cliente cliente;

    // Constructor Vacío (Requerido por JPA)
    public Mascota() {}

    // Constructor con campos (Opcional, pero útil)
    public Mascota(String nombre, String especie, String raza, LocalDate fechaNacimiento, Cliente cliente) {
        this.nombre = nombre;
        this.especie = especie;
        this.raza = raza;
        this.fechaNacimiento = fechaNacimiento;
        this.cliente = cliente;
    }
    
    // --- Getters y Setters ---

    public int getId_mascota() { return id_mascota; }
    public void setId_mascota(int id_mascota) { this.id_mascota = id_mascota; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }
    
    public String getRaza() { return raza; }
    public void setRaza(String raza) { this.raza = raza; }
    
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}