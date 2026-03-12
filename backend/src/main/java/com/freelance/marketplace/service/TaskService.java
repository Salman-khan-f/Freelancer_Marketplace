package com.freelance.marketplace.service;

import com.freelance.marketplace.entity.Task;
import com.freelance.marketplace.entity.TaskStatus;
import com.freelance.marketplace.exception.ResourceNotFoundException;
import com.freelance.marketplace.repository.TaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Task task) {
        task.setStatus(TaskStatus.OPEN);
        return taskRepository.save(task);
    }

    public Page<Task> getOpenTasks(Pageable pageable) {
        return taskRepository.findByStatus(TaskStatus.OPEN, pageable);
    }

    public Task getTaskById(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + id));
    }

    public List<Task> getTasksByCompany(UUID companyId) {
        return taskRepository.findByCompanyId(companyId);
    }

    public List<Task> getTasksByFreelancer(UUID freelancerId) {
        return taskRepository.findByFreelancerId(freelancerId);
    }

    @Transactional
    public Task updateTaskStatus(UUID taskId, TaskStatus status) {
        Task task = getTaskById(taskId);
        task.setStatus(status);
        return taskRepository.save(task);
    }
}
