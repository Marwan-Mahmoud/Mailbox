package com.example.email.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.email.dto.EmailDTO;
import com.example.email.dto.FolderDTO;
import com.example.email.exception.AccessDeniedException;
import com.example.email.exception.ResourceNotFoundException;
import com.example.email.model.Email;
import com.example.email.model.Folder;
import com.example.email.repository.EmailRepository;
import com.example.email.repository.FolderRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class FolderService {

    private final FolderRepository folderRepository;
    private final EmailRepository emailRepository;
    private final ModelMapper modelMapper;
    private final String[] systemFolders = { "Inbox", "Sent", "Drafts", "Trash" };

    public Page<FolderDTO> getFolders(String owner, Pageable pageable) {
        return folderRepository.findByOwnerAndNameNotIn(owner, List.of(systemFolders), pageable)
                .map(f -> modelMapper.map(f, FolderDTO.class));
    }

    public Page<EmailDTO> getFolderById(String id, String owner, Pageable pageable) {
        Optional<Folder> folder = folderRepository.findById(id);

        if (folder.isEmpty())
            throw new ResourceNotFoundException("Folder not found");

        if (!folder.get().getOwner().equals(owner))
            throw new AccessDeniedException("Access denied");

        List<String> ids = folder.get().getEmails();
        return emailRepository.findByIdIn(ids, pageable)
                .map(e -> modelMapper.map(e, EmailDTO.class));
    }

    public Page<EmailDTO> getFolderByName(String name, String owner, Pageable pageable) {
        Optional<Folder> folder = folderRepository.findByNameAndOwner(name, owner);

        if (folder.isEmpty())
            throw new ResourceNotFoundException("Folder not found");

        List<String> ids = folder.get().getEmails();
        return emailRepository.findByIdIn(ids, pageable)
                .map(e -> modelMapper.map(e, EmailDTO.class));
    }

    public void createSystemFolders(String owner) {
        List<Folder> folders = new ArrayList<>();
        for (String name : systemFolders) {
            Folder folder = new Folder();
            folder.setName(name);
            folder.setOwner(owner);
            folder.setEmails(new ArrayList<String>());
            folder.setCreationDate(new Date());
            folder.setSystemFolder(true);
            folders.add(folder);
        }
        folderRepository.saveAll(folders);
    }

    public boolean createFolder(String name, String owner) {
        if (folderRepository.findByNameAndOwner(name, owner).isPresent())
            return false;

        Folder folder = new Folder();
        folder.setName(name);
        folder.setOwner(owner);
        folder.setEmails(new ArrayList<String>());
        folder.setCreationDate(new Date());
        folder.setSystemFolder(false);
        folderRepository.save(folder);
        return true;
    }

    @Transactional
    public void addEmail(String name, String owner, String emailId) {
        Optional<Folder> retrievedFolder = folderRepository.findByNameAndOwner(name, owner);
        if (retrievedFolder.isEmpty())
            throw new ResourceNotFoundException("Folder not found");

        Optional<Email> retrievedEmail = emailRepository.findById(emailId);
        if (retrievedEmail.isEmpty())
            throw new ResourceNotFoundException("Email not found");

        Email email = retrievedEmail.get();
        if (!email.getFrom().equals(owner) && !email.getTo().equals(owner))
            throw new AccessDeniedException("Access denied");

        Folder folder = retrievedFolder.get();
        if (!folder.getEmails().contains(emailId)) {
            folder.getEmails().add(emailId);
            folderRepository.save(folder);
        }
    }

    @Transactional
    public void addEmailsById(String folderId, String owner, List<String> emailIds) {
        Optional<Folder> retrievedFolder = folderRepository.findById(folderId);

        if (retrievedFolder.isEmpty())
            throw new ResourceNotFoundException("Folder not found");

        Folder folder = retrievedFolder.get();
        if (!folder.getOwner().equals(owner))
            throw new AccessDeniedException("Access denied");

        List<Email> emails = emailRepository.findAllById(emailIds);
        for (Email email : emails) {
            if (!email.getFrom().equals(owner) && !email.getTo().equals(owner))
                throw new AccessDeniedException("Access denied");
        }

        List<String> existingEmailIds = folder.getEmails();
        existingEmailIds.addAll(emailIds);
        folder.setEmails(new ArrayList<>(new LinkedHashSet<>(existingEmailIds)));
        folderRepository.save(folder);
    }

    @Transactional
    public void addEmailsByName(String folderName, String owner, List<String> emailIds) {
        Optional<Folder> retrievedFolder = folderRepository.findByNameAndOwner(folderName, owner);

        if (retrievedFolder.isEmpty())
            throw new ResourceNotFoundException("Folder not found");

        List<Email> emails = emailRepository.findAllById(emailIds);
        for (Email email : emails) {
            if (!email.getFrom().equals(owner) && !email.getTo().equals(owner))
                throw new AccessDeniedException("Access denied");
        }

        Folder folder = retrievedFolder.get();
        List<String> existingEmailIds = folder.getEmails();
        existingEmailIds.addAll(emailIds);
        folder.setEmails(new ArrayList<>(new LinkedHashSet<>(existingEmailIds)));
        folderRepository.save(folder);
    }

    @Transactional
    public void removeEmailsById(String folderId, String owner, List<String> emailIds) {
        Optional<Folder> retrievedFolder = folderRepository.findById(folderId);

        if (retrievedFolder.isEmpty())
            throw new ResourceNotFoundException("Folder not found");

        Folder folder = retrievedFolder.get();
        if (!folder.getOwner().equals(owner))
            throw new AccessDeniedException("Access denied");

        folder.getEmails().removeAll(emailIds);
        folderRepository.save(folder);
    }

    @Transactional
    public void removeEmailsByName(String folderName, String owner, List<String> emailIds) {
        Optional<Folder> retrievedFolder = folderRepository.findByNameAndOwner(folderName, owner);

        if (retrievedFolder.isEmpty())
            throw new ResourceNotFoundException("Folder not found");

        Folder folder = retrievedFolder.get();
        folder.getEmails().removeAll(emailIds);
        folderRepository.save(folder);
    }

    public boolean renameFolder(String id, String owner, String name) {
        Optional<Folder> retrievedFolder = folderRepository.findById(id);

        if (retrievedFolder.isEmpty())
            throw new ResourceNotFoundException("Folder not found");

        Folder folder = retrievedFolder.get();
        if (!folder.getOwner().equals(owner) || folder.isSystemFolder())
            throw new AccessDeniedException("Access denied");

        if (folderRepository.findByNameAndOwner(name, owner).isPresent())
            return false;

        folder.setName(name);
        folderRepository.save(folder);
        return true;
    }

    public void deleteFolder(String id, String owner) {
        Optional<Folder> retrievedFolder = folderRepository.findById(id);

        if (retrievedFolder.isEmpty())
            throw new ResourceNotFoundException("Folder not found");

        Folder folder = retrievedFolder.get();
        if (!folder.getOwner().equals(owner) || folder.isSystemFolder())
            throw new AccessDeniedException("Access denied");

        folderRepository.delete(folder);
    }
}
