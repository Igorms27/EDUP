package com.edumanage.repository;

import com.edumanage.model.LessonMakeupRequest;
import com.edumanage.model.LessonMakeupRequest.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface LessonMakeupRequestRepository extends JpaRepository<LessonMakeupRequest, Long> {
    List<LessonMakeupRequest> findByStatusOrderByCreatedAtAsc(Status status);
    List<LessonMakeupRequest> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    long deleteByStatus(Status status);

    @Transactional
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    long deleteByStudentIdAndStatus(Long studentId, Status status);
}


