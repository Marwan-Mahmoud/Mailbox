package com.example.email.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.email.model.Email;

public interface EmailRepository extends MongoRepository<Email, String>, SearchRepository {

    Page<Email> findByIdIn(List<String> ids, Pageable pageable);

}
