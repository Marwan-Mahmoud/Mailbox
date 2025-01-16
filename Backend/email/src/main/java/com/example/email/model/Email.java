package com.example.email.model;

import java.util.Date;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Email {

    @Id
    private String id;

    private String from;

    private String to;

    private String subject;

    private String body;

    private Date date;

    private Boolean read;

    private Boolean draft;
}
