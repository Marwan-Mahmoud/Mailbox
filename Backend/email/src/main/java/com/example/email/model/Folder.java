package com.example.email.model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Folder {

    @Id
    private String id;

    private String name;

    private String owner;

    private List<String> emails;

    private Date creationDate;

    private boolean isSystemFolder;

}
