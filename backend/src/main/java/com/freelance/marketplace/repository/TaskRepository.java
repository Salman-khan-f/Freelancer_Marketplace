package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.Task;
import com.freelance.marketplace.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
    List<Task> findByCompanyId(UUID companyId);
    List<Task> findByFreelancerId(UUID freelancerId);
}
