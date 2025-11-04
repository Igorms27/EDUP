package com.edumanage.service;

/**
 * Serviço responsável pelo gerenciamento de matrículas de alunos em turmas.
 * Fornece operações para listar matrículas por turma ou por aluno, obter matrícula específica,
 * criar ou atualizar matrículas (upsert) com notas e faltas, e converter entidades para DTOs.
 */
import com.edumanage.dtos.request.MatriculaRequestDTO;
import com.edumanage.dtos.response.MatriculaResponseDTO;
import com.edumanage.model.Matricula;
import com.edumanage.model.Student;
import com.edumanage.repository.MatriculaRepository;
import com.edumanage.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final StudentRepository studentRepository;

    public MatriculaService(MatriculaRepository matriculaRepository, StudentRepository studentRepository) {
        this.matriculaRepository = matriculaRepository;
        this.studentRepository = studentRepository;
    }

    public List<MatriculaResponseDTO> listByTurma(String turmaId) {
        return matriculaRepository.findByTurmaIdOrderByUpdatedAtDesc(turmaId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MatriculaResponseDTO get(String turmaId, Long alunoId) {
        Optional<Matricula> opt = matriculaRepository.findByTurmaIdAndAluno_Id(turmaId, alunoId);
        return opt.map(this::toDTO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Matrícula não encontrada"));
    }

    public MatriculaResponseDTO upsert(String turmaId, Long alunoId, MatriculaRequestDTO body) {
        if (body == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Body obrigatório");
        }
        Matricula entity = matriculaRepository.findByTurmaIdAndAluno_Id(turmaId, alunoId)
                .orElseGet(() -> {
                    Student aluno = studentRepository.findById(alunoId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aluno inexistente"));
                    return new Matricula(turmaId, aluno);
                });

        entity.setNotaFinal(body.getNotaFinal());
        entity.setFaltas(body.getFaltas());

        Matricula saved = matriculaRepository.save(entity);
        return toDTO(saved);
    }

    public List<MatriculaResponseDTO> listByAluno(Long alunoId) {
        return matriculaRepository.findByAluno_IdOrderByUpdatedAtDesc(alunoId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private MatriculaResponseDTO toDTO(Matricula e) {
        return new MatriculaResponseDTO(
                e.getAluno().getId(),
                e.getTurmaId(),
                e.getNotaFinal(),
                e.getFaltas(),
                e.getUpdatedAt()
        );
    }
}


