package com.edumanage.repository;

import com.edumanage.model.Coordinator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoordinatorRepository extends JpaRepository<Coordinator, Long> {
	Optional<Coordinator> findByEmail(String email);

	Optional<Coordinator> findByEmailAndPassword(String email, String password);
}
