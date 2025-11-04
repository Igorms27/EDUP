package com.edumanage.controller;

/**
 * Controller REST para gerenciamento de solicitações de recuperação de aulas (makeup).
 * Fornece endpoints para criar solicitações, listar por status ou por estudante,
 * aprovar/rejeitar solicitações e excluir solicitações por status ou por estudante e status.
 */
import com.edumanage.dtos.request.CreateMakeupRequestDTO;
import com.edumanage.dtos.response.MakeupRequestResponseDTO;
import com.edumanage.model.LessonMakeupRequest;
import com.edumanage.model.LessonMakeupRequest.Status;
import com.edumanage.repository.LessonMakeupRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/makeups")
@CrossOrigin(origins = "http://localhost:4200")
public class MakeupRequestController {

    private final LessonMakeupRequestRepository repository;

    public MakeupRequestController(LessonMakeupRequestRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestParam("studentId") Long studentId,
                                    @RequestBody CreateMakeupRequestDTO body) {
        if (studentId == null || body == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Parâmetros inválidos");
        }
        if (body.getSubject() == null || body.getReason() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Campos obrigatórios ausentes");
        }
        LessonMakeupRequest entity = new LessonMakeupRequest(studentId, body.getSubject(), body.getReason());
        if (body.getDate() != null && !body.getDate().isBlank()) {
            entity.setDate(LocalDate.parse(body.getDate()));
        }
        if (body.getTime() != null && !body.getTime().isBlank()) {
            entity.setTime(LocalTime.parse(body.getTime()));
        }
        LessonMakeupRequest saved = repository.save(entity);

        MakeupRequestResponseDTO resp = toDTO(saved);
        return ResponseEntity.created(URI.create("/api/makeups/" + saved.getId())).body(resp);
    }

    @GetMapping
    public ResponseEntity<List<MakeupRequestResponseDTO>> listByStatus(@RequestParam(name = "status", defaultValue = "PENDING") String status) {
        Status st = Status.valueOf(status.toUpperCase());
        List<MakeupRequestResponseDTO> list = repository.findByStatusOrderByCreatedAtAsc(st)
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<MakeupRequestResponseDTO>> listByStudent(@PathVariable("studentId") Long studentId) {
        List<MakeupRequestResponseDTO> list = repository.findByStudentIdOrderByCreatedAtDesc(studentId)
                .stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable("id") Long id) {
        Optional<LessonMakeupRequest> opt = repository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Solicitação não encontrada");
        LessonMakeupRequest req = opt.get();
        req.setStatus(Status.APPROVED);
        repository.save(req);
        return ResponseEntity.ok(toDTO(req));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable("id") Long id) {
        Optional<LessonMakeupRequest> opt = repository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Solicitação não encontrada");
        LessonMakeupRequest req = opt.get();
        req.setStatus(Status.REJECTED);
        repository.save(req);
        return ResponseEntity.ok(toDTO(req));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteByStatus(@RequestParam("status") String status) {
        Status st = Status.valueOf(status.toUpperCase());
        long deleted = repository.deleteByStatus(st);
        return ResponseEntity.ok(deleted);
    }

    @DeleteMapping("/student/{studentId}")
    public ResponseEntity<?> deleteByStudentAndStatus(@PathVariable("studentId") Long studentId,
                                                      @RequestParam("status") String status) {
        Status st = Status.valueOf(status.toUpperCase());
        long deleted = repository.deleteByStudentIdAndStatus(studentId, st);
        return ResponseEntity.ok(deleted);
    }

    private MakeupRequestResponseDTO toDTO(LessonMakeupRequest e) {
        return new MakeupRequestResponseDTO(
                e.getId(),
                e.getStudentId(),
                e.getDate() == null ? null : e.getDate().toString(),
                e.getTime() == null ? null : e.getTime().toString(),
                e.getSubject(),
                e.getReason(),
                e.getStatus().name(),
                e.getCreatedAt().toString()
        );
    }
}


