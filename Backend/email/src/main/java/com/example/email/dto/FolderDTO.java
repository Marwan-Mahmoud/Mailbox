package com.example.email.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FolderDTO {

    private String id;

    @NotBlank(message = "Name is required")
    private String name;

}
