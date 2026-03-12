package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {
    Optional<ChatRoom> findByTaskIdAndCompanyIdAndFreelancerId(UUID taskId, UUID companyId, UUID freelancerId);
}
