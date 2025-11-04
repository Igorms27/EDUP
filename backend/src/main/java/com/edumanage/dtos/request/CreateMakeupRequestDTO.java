package com.edumanage.dtos.request;

/**
 * DTO de requisição para criação de solicitações de recuperação de aulas.
 * Representa os dados necessários para criar uma solicitação de makeup,
 * incluindo matéria e motivo obrigatórios, e data/horário opcionais
 * que podem ser definidos posteriormente pelo coordenador.
 */
public class CreateMakeupRequestDTO {
    private String date;   
    private String time;   
    private String subject;
    private String reason;

    public CreateMakeupRequestDTO() {
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
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
}


