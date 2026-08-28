package com.example.email.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.email.model.Attachment;

public interface AttachmentRepository extends MongoRepository<Attachment, String> {
    
    Attachment findByIdAndOwner(String id, String owner);

    Attachment findByFilenameAndOwner(String filename, String owner);

}
