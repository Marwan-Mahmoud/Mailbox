package com.example.email.controller;

import static com.example.email.util.SessionUtils.getSessionEmail;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.email.dto.EmailDTO;
import com.example.email.service.SentService;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@AllArgsConstructor
public class SentController {

    private final SentService sentService;

    @GetMapping("/sent")
    public ResponseEntity<Page<EmailDTO>> getSent(HttpSession session, Pageable pageable) {
        String email = getSessionEmail(session);

        return ResponseEntity.ok(sentService.getSent(email, pageable));
    }

    @DeleteMapping("/sent")
    public ResponseEntity<Void> moveToTrash(@RequestBody List<String> ids, HttpSession session) {
        String email = getSessionEmail(session);

        sentService.moveToTrash(ids, email);
        return ResponseEntity.ok().build();
    }
}
