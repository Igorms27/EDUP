package com.edumanage.dtos.response;

import java.math.BigDecimal;
import java.time.Instant;

public class MatriculaResponseDTO {
    private Long alunoId;
    private String turmaId;
    private BigDecimal notaFinal;
    private Integer faltas;
    private Instant updatedAt;

    public MatriculaResponseDTO() {
    }

    public MatriculaResponseDTO(Long alunoId, String turmaId, BigDecimal notaFinal, Integer faltas, Instant updatedAt) {
        this.alunoId = alunoId;
        this.turmaId = turmaId;
        this.notaFinal = notaFinal;
        this.faltas = faltas;
        this.updatedAt = updatedAt;
    }

    public Long getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(Long alunoId) {
        this.alunoId = alunoId;
    }

    public String getTurmaId() {
        return turmaId;
    }

    public void setTurmaId(String turmaId) {
        this.turmaId = turmaId;
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

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}


