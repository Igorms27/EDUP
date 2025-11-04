package com.edumanage.controller;

/**
 * Controller REST para gerenciamento de matrículas por professores.
 * Fornece endpoints para listar matrículas de uma turma, obter matrícula específica
 * de um aluno e criar/atualizar matrículas com notas e faltas.
 */
import com.edumanage.dtos.request.MatriculaRequestDTO;
import com.edumanage.dtos.response.MatriculaResponseDTO;
import com.edumanage.service.MatriculaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores/turmas/{turmaId}/matriculas")
@CrossOrigin(origins = "http://localhost:4200")
public class ProfessorTurmaMatriculaController {

    private final MatriculaService matriculaService;

    public ProfessorTurmaMatriculaController(MatriculaService matriculaService) {
        this.matriculaService = matriculaService;
    }

    @GetMapping
    public ResponseEntity<List<MatriculaResponseDTO>> list(@PathVariable("turmaId") String turmaId) {
        return ResponseEntity.ok(matriculaService.listByTurma(turmaId));
    }

    @GetMapping("/{alunoId}")
    public ResponseEntity<MatriculaResponseDTO> get(
            @PathVariable("turmaId") String turmaId,
            @PathVariable("alunoId") Long alunoId
    ) {
        return ResponseEntity.ok(matriculaService.get(turmaId, alunoId));
    }

    @PutMapping("/{alunoId}")
    public ResponseEntity<MatriculaResponseDTO> upsert(
            @PathVariable("turmaId") String turmaId,
            @PathVariable("alunoId") Long alunoId,
            @Valid @RequestBody MatriculaRequestDTO body
    ) {
        return ResponseEntity.ok(matriculaService.upsert(turmaId, alunoId, body));
    }
}


