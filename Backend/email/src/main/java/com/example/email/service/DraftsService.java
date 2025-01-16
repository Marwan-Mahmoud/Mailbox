package com.example.email.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.email.dto.EmailDTO;
import com.example.email.exception.AccessDeniedException;
import com.example.email.model.Email;
import com.example.email.repository.EmailRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class DraftsService {

    private final EmailRepository emailRepository;
    private final FolderService folderService;

    public Page<EmailDTO> getDrafts(String email, Pageable pageable) {
        return folderService.getFolderByName("Drafts", email, pageable);
    }

    @Transactional
    public void deleteDrafts(String email, List<String> ids) {
        List<Email> emails = emailRepository.findAllById(ids);
        for (Email e : emails) {
            if (!e.getFrom().equals(email) && !e.getDraft())
                throw new AccessDeniedException("Access denied");
        }

        emailRepository.deleteAll(emails);
        folderService.removeEmailsByName("Drafts", email, ids);
    }
}
