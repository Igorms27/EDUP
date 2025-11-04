package com.edumanage.dtos.request;

/**
 * DTO de requisição para operações de criação ou atualização de matrículas.
 * Representa os dados necessários para atualizar nota final e faltas de um aluno
 * em uma turma, com validações para garantir que a nota esteja entre 0.0 e 10.0.
 */
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class MatriculaRequestDTO {

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("10.0")
    private BigDecimal notaFinal;

    @NotNull
    private Integer faltas;

    public MatriculaRequestDTO() {
    }

    public MatriculaRequestDTO(BigDecimal notaFinal, Integer faltas) {
        this.notaFinal = notaFinal;
        this.faltas = faltas;
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
}


