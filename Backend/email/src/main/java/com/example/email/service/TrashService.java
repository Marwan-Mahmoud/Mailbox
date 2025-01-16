package com.example.email.service;

import java.util.ArrayList;
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
public class TrashService {

    private final EmailRepository emailRepository;
    private final FolderService folderService;

    public Page<EmailDTO> getTrash(String email, Pageable pageable) {
        return folderService.getFolderByName("Trash", email, pageable);
    }

    public void delete(List<String> ids, String email) {
        List<Email> emails = emailRepository.findAllById(ids);
        for (Email e : emails) {
            if (!e.getTo().equals(email) && !e.getFrom().equals(email))
                throw new AccessDeniedException("Access denied");
        }

        folderService.removeEmailsByName("Trash", email, ids);
    }

    @Transactional
    public void restore(List<String> ids, String email) {
        List<Email> emails = emailRepository.findAllById(ids);
        for (Email e : emails) {
            if (!e.getTo().equals(email) && !e.getFrom().equals(email))
                throw new AccessDeniedException("Access denied");
        }

        List<String> inboxIds = new ArrayList<>();
        List<String> sentIds = new ArrayList<>();
        for (Email e : emails) {
            if (e.getTo().equals(email))
                inboxIds.add(e.getId());
            else if (e.getFrom().equals(email))
                sentIds.add(e.getId());
        }

        folderService.removeEmailsByName("Trash", email, ids);
        folderService.addEmailsByName("Inbox", email, inboxIds);
        folderService.addEmailsByName("Sent", email, sentIds);
    }
}
