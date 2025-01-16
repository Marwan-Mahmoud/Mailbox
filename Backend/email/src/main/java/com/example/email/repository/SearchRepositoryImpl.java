package com.example.email.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;

import com.example.email.model.Email;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class SearchRepositoryImpl implements SearchRepository {

    private MongoTemplate mongoTemplate;

    @Override
    public Page<Email> searchEmails(List<String> ids, String from, String to, String subject, String body,
            Date startDate, Date endDate, Pageable pageable) {
        Criteria criteria = new Criteria();
        criteria.and("id").in(ids);
        if (from != null)
            criteria.and("from").regex(from, "i");
        if (to != null)
            criteria.and("to").regex(to, "i");
        if (subject != null)
            criteria.and("subject").regex(subject, "i");
        if (body != null)
            criteria.and("body").regex(body, "i");

        if (startDate != null && endDate != null)
            criteria.and("date").gte(startDate).lte(endDate);
        else if (startDate != null)
            criteria.and("date").gte(startDate);
        else if (endDate != null)
            criteria.and("date").lte(endDate);

        Query query = new Query();
        query.addCriteria(criteria);
        query.with(pageable);

        List<Email> emails = mongoTemplate.find(query, Email.class);
        return PageableExecutionUtils.getPage(emails, pageable,
                () -> mongoTemplate.count(query.limit(-1).skip(-1), Email.class));
    }

}
