package com.example.email.util;

import com.example.email.exception.UnauthorizedAccessException;

import jakarta.servlet.http.HttpSession;

public final class SessionUtils {

    public static String getSessionEmail(HttpSession session) {
        String sessionEmail = (String) session.getAttribute("email");
        if (sessionEmail == null)
            throw new UnauthorizedAccessException("Unauthorized access");

        return sessionEmail;
    }

}
