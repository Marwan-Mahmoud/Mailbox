package com.example.email.controller;

import static com.example.email.util.SessionUtils.getSessionEmail;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.email.dto.EmailDTO;
import com.example.email.service.ComposeService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/compose")
@AllArgsConstructor
public class ComposeController {

    private final ComposeService composeService;

    @PostMapping("/send")
    public ResponseEntity<Void> sendEmail(@Valid @RequestBody EmailDTO emailDTO, HttpSession session) {
        String email = getSessionEmail(session);
        if (!email.equals(emailDTO.getFrom()))
            return ResponseEntity.badRequest().build();

        composeService.sendEmail(emailDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/draft")
    public ResponseEntity<Void> saveDraft(@RequestBody EmailDTO emailDTO, HttpSession session) {
        String email = getSessionEmail(session);
        if (!email.equals(emailDTO.getFrom()))
            return ResponseEntity.badRequest().build();

        composeService.saveDraft(emailDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
