package com.freelance.marketplace.controller;

import com.freelance.marketplace.entity.ChatRoom;
import com.freelance.marketplace.entity.Message;
import com.freelance.marketplace.entity.Task;
import com.freelance.marketplace.entity.User;
import com.freelance.marketplace.repository.ChatRoomRepository;
import com.freelance.marketplace.repository.MessageRepository;
import com.freelance.marketplace.repository.UserRepository;
import com.freelance.marketplace.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final TaskService taskService;
    private final UserRepository userRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatRoomRepository chatRoomRepository,
                          MessageRepository messageRepository, TaskService taskService, UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @PostMapping("/room/{taskId}")
    public ResponseEntity<ChatRoom> createOrGetRoom(@PathVariable UUID taskId) {
        Task task = taskService.getTaskById(taskId);
        if (task.getFreelancer() == null) {
            throw new IllegalArgumentException("Cannot chat before a freelancer is assigned");
        }

        ChatRoom room = chatRoomRepository.findByTaskIdAndCompanyIdAndFreelancerId(
                taskId, task.getCompany().getId(), task.getFreelancer().getId()
        ).orElseGet(() -> {
            ChatRoom newRoom = new ChatRoom();
            newRoom.setTask(task);
            newRoom.setCompany(task.getCompany());
            newRoom.setFreelancer(task.getFreelancer());
            return chatRoomRepository.save(newRoom);
        });

        return ResponseEntity.ok(room);
    }

    @GetMapping("/room/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable UUID roomId) {
        return ResponseEntity.ok(messageRepository.findByRoomIdOrderBySentAtAsc(roomId));
    }

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable UUID roomId, @Payload MessagePayload payload) {
        ChatRoom room = chatRoomRepository.findById(roomId).orElseThrow();
        User sender = userRepository.findById(payload.getSenderId()).orElseThrow();

        Message message = new Message();
        message.setRoom(room);
        message.setSender(sender);
        message.setContent(payload.getContent());
        
        Message savedMessage = messageRepository.save(message);

        messagingTemplate.convertAndSend("/topic/room/" + roomId, savedMessage);
    }
}

class MessagePayload {
    private UUID senderId;
    private String content;

    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
