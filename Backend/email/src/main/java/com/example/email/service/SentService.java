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
public class SentService {

    private final EmailRepository emailRepository;
    private final FolderService folderService;

    public Page<EmailDTO> getSent(String email, Pageable pageable) {
        return folderService.getFolderByName("Sent", email, pageable);
    }

    @Transactional
    public void moveToTrash(List<String> ids, String email) {
        List<Email> emails = emailRepository.findAllById(ids);
        for (Email e : emails) {
            if (!e.getFrom().equals(email))
                throw new AccessDeniedException("Access denied");
        }

        folderService.removeEmailsByName("Sent", email, ids);
        folderService.addEmailsByName("Trash", email, ids);
    }
}
