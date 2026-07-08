package com.krupa.controllers;

import com.krupa.repositary.ProjectRepositary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class HealthController {

    @Autowired
    ProjectRepositary repo;

    @GetMapping("/healthCheck")
    public String health(){
        try {
            repo.count();
            return "Backend and Database are live..";
        } catch (Exception e) {
            return "Backend is Awake but i think database have some errors" +e.getMessage();
        }
    }
}
