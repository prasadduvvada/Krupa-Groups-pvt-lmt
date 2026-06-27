package com.krupa.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AdminController {

    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> login() {
        // If the execution reaches here, Spring Security Basic Auth has already passed!
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Authentication handshake successful. Welcome back, Boss.");

        return ResponseEntity.ok(response);
    }
}