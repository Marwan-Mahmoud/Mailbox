package com.example.email.model;

import java.util.Date;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attachment {

    @Id
    private String id;

    private String owner;

    private String recipient;

    private String filename;

    private String contentType;

    private Long size;

	private Date creationDate;

    private boolean uploaded;

    private short nextSequenceNumber;
}
