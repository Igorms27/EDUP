package com.edumanage.controller;

/**
 * Controller REST para gerenciamento de coordenadores.
 * Fornece endpoints para listar todos os coordenadores e criar novos coordenadores
 * no sistema.
 */
import com.edumanage.model.Coordinator;
import com.edumanage.repository.CoordinatorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/coordinators")
public class CoordinatorController {

	private final CoordinatorRepository coordinatorRepository;

	public CoordinatorController(CoordinatorRepository coordinatorRepository) {
		this.coordinatorRepository = coordinatorRepository;
	}

	@GetMapping
	public List<Coordinator> listAll() {
		return coordinatorRepository.findAll();
	}

	@PostMapping
	public ResponseEntity<Coordinator> create(@RequestBody Coordinator payload) {
		Coordinator saved = coordinatorRepository.save(payload);
		return ResponseEntity.created(URI.create("/api/coordinators/" + saved.getId())).body(saved);
	}
}
