package com.example.email.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.email.dto.EmailDTO;
import com.example.email.exception.IllegalArgumentException;
import com.example.email.exception.UserNotFoundException;
import com.example.email.model.Attachment;
import com.example.email.model.Email;
import com.example.email.repository.AttachmentRepository;
import com.example.email.repository.EmailRepository;
import com.example.email.repository.UserRepository;
import com.github.benmanes.caffeine.cache.Cache;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ComposeService {

    private final EmailRepository emailRepository;
    private final UserRepository userRepository;
    private final FolderService folderService;
    private final AttachmentRepository attachmentRepository;
    private final ModelMapper modelMapper;
    private final Cache<String, Attachment> cache;

    @Transactional
    public void sendEmail(EmailDTO emailDTO) {
        validateRecipient(emailDTO);

        List<Attachment> attachments = resolveAttachments(emailDTO.getAttachmentsId(), emailDTO.getFrom());

        for (Attachment attachment: attachments) {
            attachment.setRecipient(emailDTO.getTo());
        }

        Email email = modelMapper.map(emailDTO, Email.class);
        email.setId(null);
        email.setDate(new Date());
        email.setRead(false);
        email.setDraft(false);
        email.setAttachments(attachments);

        Email savedEmail = emailRepository.save(email);
        String id = savedEmail.getId();
        folderService.addEmail("Sent", email.getFrom(), id);
        folderService.addEmail("Inbox", email.getTo(), id);
        attachmentRepository.saveAll(attachments);

        clearCache(emailDTO.getAttachmentsId());
    }

    private void validateRecipient(EmailDTO emailDTO) {
        boolean userExists = userRepository.existsByEmail(emailDTO.getTo());
        if (!userExists) {
            throw new UserNotFoundException("Recipient email not found: " + emailDTO.getTo());
        }
    }

    private List<Attachment> resolveAttachments(List<String> attachmentIds, String owner) {
        List<Attachment> attachments = new ArrayList<>(attachmentIds.size());
        if (attachmentIds != null && !attachmentIds.isEmpty()) {
            for (String id: attachmentIds) {
                Attachment attachment = cache.getIfPresent(id);
                if (attachment == null || !attachment.getOwner().equals(owner))
                    throw new IllegalArgumentException("One or more attachments are invalid or have expired " + id);
                attachments.add(attachment);
            }
        }
        return attachments;
    }

    private void clearCache(List<String> attachmentIds) {
        if (attachmentIds != null && !attachmentIds.isEmpty()) {
            cache.invalidateAll(attachmentIds);
        }
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
