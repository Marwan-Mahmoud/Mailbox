package com.example.email.service;

import java.util.Date;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.email.dto.EmailDTO;
import com.example.email.model.Email;
import com.example.email.repository.EmailRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ComposeService {

    private final EmailRepository emailRepository;
    private final FolderService folderService;
    private final ModelMapper modelMapper;

    @Transactional
    public void sendEmail(EmailDTO emailDTO) {
        Email email = modelMapper.map(emailDTO, Email.class);
        email.setId(null);
        email.setDate(new Date());
        email.setRead(false);
        email.setDraft(false);

        Email savedEmail = emailRepository.save(email);
        String id = savedEmail.getId();
        folderService.addEmail("Sent", email.getFrom(), id);
        folderService.addEmail("Inbox", email.getTo(), id);
    }

    @Transactional
    public void saveDraft(EmailDTO emailDTO) {
        Email email = modelMapper.map(emailDTO, Email.class);
        email.setDate(new Date());
        email.setRead(true);
        email.setDraft(true);

        Email savedEmail = emailRepository.save(email);
        String id = savedEmail.getId();
        folderService.addEmail("Drafts", email.getFrom(), id);
    }
}
