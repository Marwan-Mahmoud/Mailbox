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
public class InboxService {

    private final EmailRepository emailRepository;
    private final FolderService folderService;

    public Page<EmailDTO> getInbox(String email, Pageable pageable) {
        return folderService.getFolderByName("Inbox", email, pageable);
    }

    public void markAs(List<String> ids, String email, boolean read) {
        List<Email> emails = emailRepository.findAllById(ids);
        for (Email e : emails) {
            if (!e.getTo().equals(email))
                throw new AccessDeniedException("Access denied");
        }

        for (Email e : emails) {
            e.setRead(read);
        }
        emailRepository.saveAll(emails);
    }

    @Transactional
    public void moveToTrash(List<String> ids, String email) {
        List<Email> emails = emailRepository.findAllById(ids);
        for (Email e : emails) {
            if (!e.getTo().equals(email))
                throw new AccessDeniedException("Access denied");
        }

        folderService.removeEmailsByName("Inbox", email, ids);
        folderService.addEmailsByName("Trash", email, ids);
    }
}
