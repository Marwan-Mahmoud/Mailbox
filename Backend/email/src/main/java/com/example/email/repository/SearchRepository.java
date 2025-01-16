package com.example.email.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.email.model.Email;

public interface SearchRepository {

    Page<Email> searchEmails(List<String> ids, String from, String to, String subject, String body,
            Date startDate, Date endDate, Pageable pageable);
}
