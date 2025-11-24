package com.veterinaria.backend.model;

import jakarta.persistence.*;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "citas")
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCita;

    @Column(name = "fecha_hora", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaHora;

    @Column(name = "motivo", nullable = false, length = 255)
    private String motivo;
    
    @Column(name = "estado", nullable = false, length = 50)
    private String estado = "PROGRAMADA"; // Por defecto

    // Relación ManyToOne con Empleado (Veterinario/Atención)
    // Usamos EAGER para cargar el empleado al cargar la cita
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id", nullable = false)
    @JsonIgnore // Evitamos serializar todo el objeto Empleado en la respuesta JSON de Cita
    private Empleado empleado;

    // Relación ManyToOne con Mascota (Paciente)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mascota_id", nullable = false)
    @JsonIgnore // Evitamos serializar todo el objeto Mascota en la respuesta JSON de Cita
    private Mascota mascota;

    // --- Campos Transitorios para la comunicación (INPUT/OUTPUT) ---

    // ID del empleado para recibirlo del frontend
    @Transient
    private Integer empleadoId;
    
    // ID de la mascota para recibirla del frontend
    @Transient
    private Integer mascotaId;

    // --- Constructores, Getters y Setters ---

    public Cita() {}

    public Integer getIdCita() { return idCita; }
    public void setIdCita(Integer idCita) { this.idCita = idCita; }

    public Date getFechaHora() { return fechaHora; }
    public void setFechaHora(Date fechaHora) { this.fechaHora = fechaHora; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Empleado getEmpleado() { return empleado; }
    public void setEmpleado(Empleado empleado) { this.empleado = empleado; }

    public Mascota getMascota() { return mascota; }
    public void setMascota(Mascota mascota) { this.mascota = mascota; }

    // --- Getters/Setters para IDs Transitorios (Comunicación con Frontend) ---

    public Integer getEmpleadoId() { return empleadoId; }
    public void setEmpleadoId(Integer empleadoId) { this.empleadoId = empleadoId; }

    public Integer getMascotaId() { return mascotaId; }
    public void setMascotaId(Integer mascotaId) { this.mascotaId = mascotaId; }

    // --- Getters de Salida para el Frontend (OUTPUT) ---

    // Devuelve el ID del empleado incluso si se ignoró el objeto Empleado
    @JsonProperty("empleadoId")
    public Integer getEmpleadoIdOutput() {
        return this.empleado != null ? this.empleado.getId_empleado() : this.empleadoId;
    }

    // Devuelve el ID de la mascota incluso si se ignoró el objeto Mascota
    @JsonProperty("mascotaId")
    public Integer getMascotaIdOutput() {
        return this.mascota != null ? this.mascota.getId_mascota() : this.mascotaId;
    }
    
    // Devuelve el nombre del Empleado (para la tabla)
    @JsonProperty("nombreVeterinario")
    public String getNombreVeterinario() {
        return this.empleado != null ? this.empleado.getNombre() + " " + this.empleado.getApellido() : "N/A";
    }
    
    // Devuelve el nombre de la Mascota (para la tabla)
    @JsonProperty("nombreMascota")
    public String getNombreMascota() {
        return this.mascota != null ? this.mascota.getNombre() : "N/A";
    }
}