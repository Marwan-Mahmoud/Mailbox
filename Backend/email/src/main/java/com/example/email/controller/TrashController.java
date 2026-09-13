package com.example.email.controller;

import static com.example.email.util.SessionUtils.getSessionEmail;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.email.dto.EmailDTO;
import com.example.email.service.TrashService;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "${app.cors.origin}", allowCredentials = "true")
@AllArgsConstructor
public class TrashController {

    private final TrashService trashService;

    @GetMapping("/trash")
    public ResponseEntity<Page<EmailDTO>> getTrash(HttpSession session, Pageable pageable) {
        String email = getSessionEmail(session);

        return ResponseEntity.ok(trashService.getTrash(email, pageable));
    }

    @DeleteMapping("/trash")
    public ResponseEntity<Void> delete(@RequestBody List<String> ids, HttpSession session) {
        String email = getSessionEmail(session);

        trashService.delete(ids, email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/trash")
    public ResponseEntity<Void> restore(@RequestBody List<String> ids, HttpSession session) {
        String email = getSessionEmail(session);

        trashService.restore(ids, email);
        return ResponseEntity.ok().build();
    }
}
