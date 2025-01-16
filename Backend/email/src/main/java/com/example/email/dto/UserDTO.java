package com.example.email.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "[a-zA-Z0-9!@#$%^&*]{8,}",
        message = "Password must be at least 8 characters long and contain only letters, numbers, and special characters !@#$%^&*")
    private String password;

}
