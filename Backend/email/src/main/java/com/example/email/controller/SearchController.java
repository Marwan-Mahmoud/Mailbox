package com.example.email.controller;

import static com.example.email.util.SessionUtils.getSessionEmail;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.email.dto.EmailDTO;
import com.example.email.service.SearchService;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@AllArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/search")
    public ResponseEntity<Page<EmailDTO>> searchEmails(HttpSession session, Pageable pageable,
            @RequestParam(required = true) String folders,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String body,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
    
        String email = getSessionEmail(session);
    
        return ResponseEntity.ok(searchService.search(email, folders, from, to, subject, body, startDate, endDate, pageable));
    }

}
