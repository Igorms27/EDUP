package com.edumanage.model;

/**
 * Entidade JPA que representa uma solicitação de recuperação de aula.
 * Mapeia a tabela "lesson_makeup_requests" e contém informações sobre solicitações
 * de reposição de aulas feitas por estudantes, incluindo matéria, motivo, data/horário
 * opcionais, status (PENDING, APPROVED, REJECTED) e timestamp de criação.
 */
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "lesson_makeup_requests")
public class LessonMakeupRequest {

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long studentId;

    @Column(nullable = true)
    private LocalDate date;

    @Column(nullable = true)
    private LocalTime time;

    @Column(nullable = false, length = 120)
    private String subject;

    @Column(nullable = false, length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public LessonMakeupRequest() {
    }

    public LessonMakeupRequest(Long studentId, LocalDate date, LocalTime time, String subject, String reason) {
        this.studentId = studentId;
        this.date = date;
        this.time = time;
        this.subject = subject;
        this.reason = reason;
        this.status = Status.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public LessonMakeupRequest(Long studentId, String subject, String reason) {
        this.studentId = studentId;
        this.subject = subject;
        this.reason = reason;
        this.status = Status.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


