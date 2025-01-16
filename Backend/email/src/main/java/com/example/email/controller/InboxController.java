package com.example.email.controller;

import static com.example.email.util.SessionUtils.getSessionEmail;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.email.dto.EmailDTO;
import com.example.email.service.InboxService;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@AllArgsConstructor
public class InboxController {

    private final InboxService inboxService;

    @GetMapping("/inbox")
    public ResponseEntity<Page<EmailDTO>> getInbox(HttpSession session, Pageable pageable) {
        String email = getSessionEmail(session);

        return ResponseEntity.ok(inboxService.getInbox(email, pageable));
    }

    @PatchMapping("/inbox")
    public ResponseEntity<Void> markAs(@RequestBody List<String> ids, @RequestParam boolean read, HttpSession session) {
        String email = getSessionEmail(session);

        inboxService.markAs(ids, email, read);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/inbox")
    public ResponseEntity<Void> moveToTrash(@RequestBody List<String> ids, HttpSession session) {
        String email = getSessionEmail(session);

        inboxService.moveToTrash(ids, email);
        return ResponseEntity.ok().build();
    }
}
