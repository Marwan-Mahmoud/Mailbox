package com.example.email.controller;

import static com.example.email.util.SessionUtils.getSessionEmail;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.email.dto.AttachmentDTO;
import com.example.email.service.AttachmentService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/attachments")
@AllArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @GetMapping("{id}/download")
    public ResponseEntity<String> getSignedDownloadURL(@PathVariable String id, HttpSession session) {
        String email = getSessionEmail(session);
        String signedUrl = attachmentService.getSignedDownloadURL(id, email);
        return ResponseEntity.ok(signedUrl);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> getSignedUploadURL(@Valid @RequestBody AttachmentDTO attachmentDTO, HttpSession session) {
        String email = getSessionEmail(session);
        String signedUrl = attachmentService.getSignedUploadURL(attachmentDTO, email);
        return ResponseEntity.ok(signedUrl);
    }

    @PatchMapping("{id}/confirm")
    public ResponseEntity<Void> confirmUpload(@PathVariable String id, HttpSession session) {
        String email = getSessionEmail(session);
        attachmentService.confirmUpload(id, email);
        return ResponseEntity.ok().build();
    }
}
