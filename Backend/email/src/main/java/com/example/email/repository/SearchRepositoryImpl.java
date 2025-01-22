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
    public Page<Email> searchEmails(List<String> ids, String keywords, String from, String to, String subject,
            Date startDate, Date endDate, Pageable pageable) {
        Criteria keywordsCriteria = new Criteria();
        keywordsCriteria.orOperator(
                Criteria.where("from").regex(keywords, "i"),
                Criteria.where("to").regex(keywords, "i"),
                Criteria.where("subject").regex(keywords, "i"),
                Criteria.where("body").regex(keywords, "i"));

        Criteria filterCriteria = Criteria.where("id").in(ids);
        if (from != null)
            filterCriteria.and("from").regex(from, "i");
        if (to != null)
            filterCriteria.and("to").regex(to, "i");
        if (subject != null)
            filterCriteria.and("subject").regex(subject, "i");

        if (startDate != null && endDate != null)
            filterCriteria.and("date").gte(startDate).lte(endDate);
        else if (startDate != null)
            filterCriteria.and("date").gte(startDate);
        else if (endDate != null)
            filterCriteria.and("date").lte(endDate);

        Query query = new Query();
        query.addCriteria(keywordsCriteria).addCriteria(filterCriteria);

        query.with(pageable);

        List<Email> emails = mongoTemplate.find(query, Email.class);
        return PageableExecutionUtils.getPage(emails, pageable,
                () -> mongoTemplate.count(query.limit(-1).skip(-1), Email.class));
    }
}
