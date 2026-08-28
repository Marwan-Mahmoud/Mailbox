package com.example.email.dto;

import java.util.Date;
import java.util.List;

import com.example.email.model.Attachment;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailDTO {

    private String id;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String from;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String to;

    @NotBlank(message = "Subject is required")
    private String subject;

    private String body;

    private Date date;

    private Boolean read;

    private Boolean draft;

    @Size(max = 5, message = "Maximum number of attachments is 5")
    private List<Attachment> attachments;

    @Size(max = 5, message = "Maximum number of attachments is 5")
    private List<String> attachmentsId;
}
