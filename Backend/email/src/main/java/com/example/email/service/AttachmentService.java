package com.example.email.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.email.dto.AttachmentDTO;
import com.example.email.exception.ResourceNotFoundException;
import com.example.email.exception.UserNotFoundException;
import com.example.email.model.Attachment;
import com.example.email.repository.AttachmentRepository;
import com.example.email.repository.UserRepository;
import com.github.benmanes.caffeine.cache.Cache;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    @Value("${storage.endpoint}")
    private String storageBaseUrl;

    @Value("${storage.bucket}")
    private String bucketName;

    @Value("${storage.api.key}")
    private String apiKey;

    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final RestClient restClient = RestClient.create();
    private final Cache<String, Attachment> cache;
    
    public String getSignedDownloadURL(String id, String requester) {
        boolean userExists = userRepository.existsByEmail(requester);
        if (!userExists) {
            throw new UserNotFoundException("Recipient email not found: " + requester);
        }

        Attachment attachment = fetchAttachment(id, requester);

        Map<String, Integer> requestBody = Map.of("expiresIn", 120);
        Map<?, ?> response = restClient.post()
            .uri(String.format("%s/object/sign/%s/%s", storageBaseUrl, bucketName, attachment.getId()))
            .header("apikey", apiKey)
            .body(requestBody)
            .retrieve()
            .body(Map.class);
        String signedUrl = String.format("%s%s&download=%s",
            storageBaseUrl,
            response.get("signedURL"),
            URLEncoder.encode(attachment.getFilename(), StandardCharsets.UTF_8));
        return signedUrl;
    }

    private Attachment fetchAttachment(String id, String requester) {
        Optional<Attachment> foundAttachment = Optional.ofNullable(cache.getIfPresent(id));
        if (foundAttachment.isEmpty())
            foundAttachment = attachmentRepository.findById(id);

        if (foundAttachment.isEmpty() ||
            !(requester.equals(foundAttachment.get().getOwner()) ||
            requester.equals(foundAttachment.get().getRecipient()))
        ) {
            throw new ResourceNotFoundException("Attachment not found: " + id);
        }
        return foundAttachment.get();
    }
    
    public String getSignedUploadURL(AttachmentDTO attachmentDTO, String owner) {
        boolean userExists = userRepository.existsByEmail(owner);
        if (!userExists) {
            throw new UserNotFoundException("Sender email not found: " + owner);
        }

        Attachment attachment = attachmentRepository.findByFilenameAndOwner(attachmentDTO.getFilename(), owner);
        if (attachment != null) {
            short nextSequenceNumber = attachment.getNextSequenceNumber();
            attachment.setNextSequenceNumber((short) (nextSequenceNumber + 1));
            attachmentRepository.save(attachment);
            String deduplicatedFilename = deduplicateFilename(attachmentDTO.getFilename(), nextSequenceNumber);
            attachmentDTO.setFilename(deduplicatedFilename);
        }

        String attachmentId = saveAttachmentMetadata(attachmentDTO, owner);
        Map<String, Integer> requestBody = Map.of("expiresIn", 120);
        Map<?, ?> response = restClient.post()
                .uri(String.format("%s/object/upload/sign/%s/%s", storageBaseUrl, bucketName, attachmentId))
                .header("apikey", apiKey)
                .body(requestBody)
                .retrieve()
                .body(Map.class);
        String signedUrl = storageBaseUrl + response.get("url");
        return signedUrl;
    }

    private String deduplicateFilename(String filename, short nextSequenceNumber) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex == -1) {
            return String.format("%s (%d)", filename, nextSequenceNumber);
        } else {
            String namePart = filename.substring(0, dotIndex);
            String extensionPart = filename.substring(dotIndex);
            return String.format("%s (%d)%s", namePart, nextSequenceNumber, extensionPart);
        }
    }

    private String saveAttachmentMetadata(AttachmentDTO attachmentDTO, String owner) {
        Attachment attachment = modelMapper.map(attachmentDTO, Attachment.class);
        String attachmentId = new ObjectId().toHexString();
        attachment.setId(attachmentId);
        attachment.setOwner(owner);
        attachment.setCreationDate(new Date());
        attachment.setUploaded(false);
        attachment.setNextSequenceNumber((short) 1);
        cache.put(attachmentId, attachment);
        return attachmentId;
    }
    
    public void confirmUpload(String id, String owner) {
        Attachment attachment = cache.getIfPresent(id);
        if (attachment == null || !attachment.getOwner().equals(owner)) {
            throw new ResourceNotFoundException("Attachment not found: " + id);
        }
        attachment.setUploaded(true);
        cache.put(id, attachment);
    }
}
