package com.freelance.marketplace.service;

import com.freelance.marketplace.entity.Bid;
import com.freelance.marketplace.entity.BidStatus;
import com.freelance.marketplace.entity.Task;
import com.freelance.marketplace.entity.TaskStatus;
import com.freelance.marketplace.exception.ResourceNotFoundException;
import com.freelance.marketplace.repository.BidRepository;
import com.freelance.marketplace.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BidService {

    private final BidRepository bidRepository;
    private final TaskRepository taskRepository;

    public BidService(BidRepository bidRepository, TaskRepository taskRepository) {
        this.bidRepository = bidRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional
    public Bid placeBid(Bid bid) {
        Task task = taskRepository.findById(bid.getTask().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getStatus() != TaskStatus.OPEN) {
            throw new IllegalArgumentException("Cannot bid on a task that is not OPEN");
        }

        if (task.getCompany().getId().equals(bid.getFreelancer().getId())) {
            throw new IllegalArgumentException("Company cannot bid on its own task");
        }

        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        long dailyBids = bidRepository.countBidsByFreelancerInTimeframe(bid.getFreelancer().getId(), startOfDay);

        if (dailyBids >= 10) {
            throw new IllegalArgumentException("Freelancer has reached the maximum of 10 bids per day");
        }

        // Additional validation
        if (bid.getAmount().compareTo(task.getBudgetMin()) < 0 || bid.getAmount().compareTo(task.getBudgetMax()) > 0) {
            throw new IllegalArgumentException("Bid amount is outside the task budget constraints");
        }

        bid.setStatus(BidStatus.PENDING);
        return bidRepository.save(bid);
    }

    public List<Bid> getBidsForTask(UUID taskId) {
        return bidRepository.findByTaskId(taskId);
    }

    public List<Bid> getBidsByFreelancer(UUID freelancerId) {
        return bidRepository.findByFreelancerId(freelancerId);
    }

    @Transactional
    public Bid acceptBid(UUID bidId) {
        Bid acceptedBid = bidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));

        if (acceptedBid.getStatus() != BidStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bids can be accepted");
        }

        Task task = acceptedBid.getTask();
        if (task.getStatus() != TaskStatus.OPEN) {
            throw new IllegalArgumentException("Task is no longer OPEN for bidding");
        }

        // 1. Accept this bid
        acceptedBid.setStatus(BidStatus.ACCEPTED);
        bidRepository.save(acceptedBid);

        // 2. Reject all other bids for this task
        List<Bid> otherBids = bidRepository.findByTaskId(task.getId());
        for (Bid b : otherBids) {
            if (!b.getId().equals(acceptedBid.getId()) && b.getStatus() == BidStatus.PENDING) {
                b.setStatus(BidStatus.REJECTED);
                bidRepository.save(b);
            }
        }

        // 3. Update task status and assign freelancer
        task.setStatus(TaskStatus.ASSIGNED);
        task.setFreelancer(acceptedBid.getFreelancer());
        taskRepository.save(task);

        return acceptedBid;
    }

    @Transactional
    public Bid rejectBid(UUID bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found"));

        if (bid.getStatus() != BidStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bids can be rejected");
        }

        bid.setStatus(BidStatus.REJECTED);
        return bidRepository.save(bid);
    }
}
