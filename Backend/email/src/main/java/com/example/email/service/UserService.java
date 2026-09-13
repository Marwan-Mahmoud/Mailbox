package com.example.email.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.email.dto.UserDTO;
import com.example.email.model.User;
import com.example.email.repository.UserRepository;

import at.favre.lib.crypto.bcrypt.BCrypt;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    @Value("${app.domain}")
    private String domain;

    private final UserRepository userRepository;
    private final FolderService folderService;

    public boolean login(UserDTO userDTO) {
        Optional<User> user = userRepository.findByEmail(userDTO.getEmail());
        if (user.isEmpty()) {
            return false;
        }

        String password = userDTO.getPassword();
        String hash = user.get().getPassword();

        return BCrypt.verifyer().verify(password.toCharArray(), hash).verified;
    }

    @Transactional
    public boolean register(UserDTO userDTO) {
        String email = userDTO.getEmail();
        boolean userExists = userRepository.existsByEmail(email);
        if (userExists) {
            return false;
        }

        if (!verifyDomain(email)) {
            return false;
        }

        String password = userDTO.getPassword();
        String hash = BCrypt.withDefaults().hashToString(12, password.toCharArray());

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(hash);

        userRepository.save(newUser);
        folderService.createSystemFolders(email);
        return true;
    }

    private boolean verifyDomain(String email) {
        return domain.equalsIgnoreCase(email.split("@")[1]);
    }
}
