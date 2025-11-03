package com.edumanage.dtos.response;

public class MakeupRequestResponseDTO {
    private Long id;
    private Long studentId;
    private String date;
    private String time;
    private String subject;
    private String reason;
    private String status;
    private String createdAt;

    public MakeupRequestResponseDTO() {
    }

    public MakeupRequestResponseDTO(Long id, Long studentId, String date, String time, String subject, String reason, String status, String createdAt) {
        this.id = id;
        this.studentId = studentId;
        this.date = date;
        this.time = time;
        this.subject = subject;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}


