package com.edumanage.controller;

/**
 * Controller REST para consulta de matrículas por aluno.
 * Fornece endpoints para listar todas as matrículas de um aluno específico,
 * permitindo que estudantes visualizem suas notas e faltas em todas as turmas.
 */
import com.edumanage.dtos.response.MatriculaResponseDTO;
import com.edumanage.service.MatriculaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos/{alunoId}/matriculas")
@CrossOrigin(origins = "http://localhost:4200")
public class AlunoMatriculaController {

    private final MatriculaService matriculaService;

    public AlunoMatriculaController(MatriculaService matriculaService) {
        this.matriculaService = matriculaService;
    }

    @GetMapping
    public ResponseEntity<List<MatriculaResponseDTO>> listByAluno(@PathVariable("alunoId") Long alunoId) {
        return ResponseEntity.ok(matriculaService.listByAluno(alunoId));
    }
}


