package com.edumanage.repository;

import com.edumanage.model.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatriculaRepository extends JpaRepository<Matricula, String> {

    List<Matricula> findByTurmaIdOrderByUpdatedAtDesc(String turmaId);

    Optional<Matricula> findByTurmaIdAndAluno_Id(String turmaId, Long alunoId);

    boolean existsByTurmaIdAndAluno_Id(String turmaId, Long alunoId);

    List<Matricula> findByAluno_IdOrderByUpdatedAtDesc(Long alunoId);
}


