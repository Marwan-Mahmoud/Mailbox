package com.example.email.dto;

import java.util.Date;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
}
