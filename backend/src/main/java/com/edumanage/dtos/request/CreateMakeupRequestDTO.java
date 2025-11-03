package com.edumanage.dtos.request;

public class CreateMakeupRequestDTO {
    private String date;   // opcional: ISO yyyy-MM-dd (definido pelo coordenador)
    private String time;   // opcional: HH:mm (definido pelo coordenador)
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


