package com.example.email.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentDTO {

    private String id;
    
    @NotBlank(message = "Filename is required")
    private String filename;

    private String contentType;

    @Min(value = 1, message = "File is empty")
    @Max(value = 20971520, message = "File size exceeds the maximum limit of 20MB")
    private Long size;
}
