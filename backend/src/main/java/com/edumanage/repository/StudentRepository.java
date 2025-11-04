package com.edumanage.repository;

/**
 * Repositório JPA para operações de acesso a dados da entidade Student.
 * Estende JpaRepository fornecendo métodos CRUD padrão e permite buscar
 * estudantes por email e senha para autenticação.
 */
import com.edumanage.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByEmailAndPassword(String email, String password);
}


