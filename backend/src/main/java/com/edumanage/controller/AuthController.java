package com.edumanage.controller;

/**
 * Controller REST para operações de autenticação.
 * Fornece endpoints para realizar login de usuários (estudantes, professores e coordenadores),
 * validando credenciais e retornando informações do usuário autenticado com seu respectivo tipo.
 */
import com.edumanage.dtos.request.LoginRequestDTO;
import com.edumanage.dtos.response.LoginResponseDTO;
import com.edumanage.model.Coordinator;
import com.edumanage.model.Professor;
import com.edumanage.model.Student;
import com.edumanage.repository.CoordinatorRepository;
import com.edumanage.repository.ProfessorRepository;
import com.edumanage.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final CoordinatorRepository coordinatorRepository;
    private final ProfessorRepository professorRepository;
    private final StudentRepository studentRepository;

    public AuthController(CoordinatorRepository coordinatorRepository, ProfessorRepository professorRepository, StudentRepository studentRepository) {
        this.coordinatorRepository = coordinatorRepository;
        this.professorRepository = professorRepository;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO body) {
        if (body.getEmail() == null || body.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email e senha são obrigatórios");
        }

        final String email = body.getEmail().trim().toLowerCase();
        final String password = body.getPassword();

        // 1) Tenta aluno por email+senha (prioriza aluno para evitar colisões de e-mail)
        Optional<Student> studentOpt = studentRepository.findByEmailAndPassword(email, password);
        if (studentOpt.isPresent()) {
            Student s = studentOpt.get();
            LoginResponseDTO resp = new LoginResponseDTO(
                s.getId(), s.getName(), s.getEmail(), "Login efetuado com sucesso");
            resp.setType("student");
            logger.info("Login efetuado com sucesso: {} (student)", s.getEmail());
            return ResponseEntity.ok(resp);
        }

        // 2) Tenta professor por email+senha
        Optional<Professor> professorOpt = professorRepository.findByEmailAndPassword(email, password);
        if (professorOpt.isPresent()) {
            Professor p = professorOpt.get();
            LoginResponseDTO resp = new LoginResponseDTO(
                p.getId(), p.getName(), p.getEmail(), "Login efetuado com sucesso");
            resp.setType("teacher");
            logger.info("Login efetuado com sucesso: {} (teacher)", p.getEmail());
            return ResponseEntity.ok(resp);
        }

        // 3) Tenta coordenador por email+senha
        Optional<Coordinator> coordinatorOpt = coordinatorRepository.findByEmailAndPassword(email, password);
        if (coordinatorOpt.isPresent()) {
            Coordinator c = coordinatorOpt.get();
            LoginResponseDTO resp = new LoginResponseDTO(
                c.getId(), c.getName(), c.getEmail(), "Login efetuado com sucesso");
            resp.setType("coordinator");
            logger.info("Login efetuado com sucesso: {} (coordinator)", c.getEmail());
            return ResponseEntity.ok(resp);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
    }
}
