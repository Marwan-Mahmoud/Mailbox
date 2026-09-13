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
import com.example.email.service.DraftsService;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "${app.cors.origin}", allowCredentials = "true")
@AllArgsConstructor
public class DraftsController {

    private final DraftsService draftsService;

    @GetMapping("/drafts")
    public ResponseEntity<Page<EmailDTO>> getDrafts(HttpSession session, Pageable pageable) {
        String email = getSessionEmail(session);

        return ResponseEntity.ok(draftsService.getDrafts(email, pageable));
    }

    @DeleteMapping("/drafts")
    public ResponseEntity<Void> deleteDrafts(@RequestBody List<String> ids, HttpSession session) {
        String email = getSessionEmail(session);

        draftsService.deleteDrafts(email, ids);
        return ResponseEntity.ok().build();
    }

}
