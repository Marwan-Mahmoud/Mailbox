package com.example.email.service;

import java.util.Date;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.email.dto.EmailDTO;
import com.example.email.exception.IllegalArgumentException;
import com.example.email.repository.EmailRepository;
import com.example.email.repository.FolderRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class SearchService {

    private final EmailRepository emailRepository;
    private final FolderRepository folderRepository;
    private final ModelMapper modelMapper;

    public Page<EmailDTO> search(String email, String folders, String keywords, String from, String to, String subject,
            Date startDate, Date endDate, Pageable pageable) {
        List<String> folderNames = getFolderNames(folders);
        List<String> ids = folderRepository.findByNameInAndOwner(folderNames, email).stream()
                .map(f -> f.getEmails()).flatMap(List::stream).toList();

        return emailRepository.searchEmails(ids, keywords, from, to, subject, startDate, endDate, pageable)
                .map(e -> modelMapper.map(e, EmailDTO.class));
    }

    private List<String> getFolderNames(String folders) {
        List<String> basicFolders = List.of("Inbox", "Sent", "Draft", "Trash");
        if (folders.equals("All"))
            return basicFolders;
        else if (basicFolders.contains(folders))
            return List.of(folders);
        else
            throw new IllegalArgumentException("Invalid folder name");
    }
}
