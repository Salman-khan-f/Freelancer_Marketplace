package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BidRepository extends JpaRepository<Bid, UUID> {
    List<Bid> findByTaskId(UUID taskId);
    List<Bid> findByFreelancerId(UUID freelancerId);

    @Query("SELECT COUNT(b) FROM Bid b WHERE b.freelancer.id = :freelancerId AND b.createdAt >= :startDate")
    long countBidsByFreelancerInTimeframe(@Param("freelancerId") UUID freelancerId, @Param("startDate") LocalDateTime startDate);
}
