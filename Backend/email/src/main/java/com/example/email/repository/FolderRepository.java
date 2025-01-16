package com.example.email.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.email.model.Folder;

public interface FolderRepository extends MongoRepository<Folder, String> {

    Page<Folder> findByOwner(String owner, Pageable pageable);

    Optional<Folder> findByNameAndOwner(String name, String owner);

    List<Folder> findByNameInAndOwner(List<String> names, String owner);

}
