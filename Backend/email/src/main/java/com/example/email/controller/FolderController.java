package com.example.email.controller;

import static com.example.email.util.SessionUtils.getSessionEmail;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.email.dto.EmailDTO;
import com.example.email.dto.FolderDTO;
import com.example.email.service.FolderService;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@AllArgsConstructor
@RequestMapping("/folders")
public class FolderController {

    private final FolderService folderService;

    @GetMapping
    public ResponseEntity<Page<FolderDTO>> getFolders(HttpSession session, Pageable pageable) {
        String email = getSessionEmail(session);

        return ResponseEntity.ok(folderService.getFolders(email, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Page<EmailDTO>> getFolder(@PathVariable String id, HttpSession session, Pageable pageable) {
        String email = getSessionEmail(session);

        return ResponseEntity.ok(folderService.getFolderById(id, email, pageable));
    }

    @PostMapping
    public ResponseEntity<Void> createFolder(@RequestParam String name, HttpSession session) {
        String email = getSessionEmail(session);

        if (folderService.createFolder(name, email))
            return ResponseEntity.status(HttpStatus.CREATED).build();
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PatchMapping("/{id}/add")
    public ResponseEntity<Void> addEmails(@PathVariable String id, @RequestBody List<String> emailIds,
            HttpSession session) {
        String email = getSessionEmail(session);

        folderService.addEmailsById(id, email, emailIds);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/remove")
    public ResponseEntity<Void> removeEmails(@PathVariable String id, @RequestBody List<String> emailIds,
            HttpSession session) {
        String email = getSessionEmail(session);

        folderService.removeEmailsById(id, email, emailIds);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/rename")
    public ResponseEntity<Void> renameFolder(@PathVariable String id, @RequestParam String name, HttpSession session) {
        String email = getSessionEmail(session);

        if (folderService.renameFolder(id, email, name))
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable String id, HttpSession session) {
        String email = getSessionEmail(session);

        folderService.deleteFolder(id, email);
        return ResponseEntity.ok().build();
    }

}
