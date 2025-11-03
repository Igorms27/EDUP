package com.edumanage.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "matriculas", uniqueConstraints = {
        @UniqueConstraint(name = "uk_matriculas_turma_aluno", columnNames = {"turma_id", "aluno_id"})
})
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank
    @Column(name = "turma_id", nullable = false, length = 100)
    private String turmaId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "aluno_id", nullable = false, foreignKey = @ForeignKey(name = "fk_matriculas_students"))
    private Student aluno;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "10.0")
    @Column(name = "nota_final", precision = 4, scale = 2)
    private BigDecimal notaFinal;

    @Column(name = "faltas")
    private Integer faltas;

    @Column(name = "updated_at", nullable = false, updatable = true)
    private Instant updatedAt;

    public Matricula() {
    }

    public Matricula(String turmaId, Student aluno) {
        this.turmaId = turmaId;
        this.aluno = aluno;
        this.updatedAt = Instant.now();
    }

    @PrePersist
    @PreUpdate
    public void touch() {
        this.updatedAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public String getTurmaId() {
        return turmaId;
    }

    public void setTurmaId(String turmaId) {
        this.turmaId = turmaId;
    }

    public Student getAluno() {
        return aluno;
    }

    public void setAluno(Student aluno) {
        this.aluno = aluno;
    }

    public BigDecimal getNotaFinal() {
        return notaFinal;
    }

    public void setNotaFinal(BigDecimal notaFinal) {
        this.notaFinal = notaFinal;
    }

    public Integer getFaltas() {
        return faltas;
    }

    public void setFaltas(Integer faltas) {
        this.faltas = faltas;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}


