package com.krupa.controllers;

import com.krupa.Dto.ProjectRequest;
import com.krupa.Services.FurnitureService;
import com.krupa.Services.ProjectService;
import com.krupa.model.Projects;
import com.krupa.repositary.ProjectRepositary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects") // Clean, dedicated module path
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ProjectController {

    @Autowired
    private ProjectService service;

    private final ProjectRepositary repository;
    public ProjectController(ProjectRepositary repository) { this.repository = repository; }

    // Fetches text details for your dashboard lists
    @GetMapping
    public ResponseEntity<List<Projects>> getAllProjects() {
        return ResponseEntity.ok(repository.findAll());
    }

    // Streaming single binary images safely on-demand by ID
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProjectImage(@PathVariable Long id) {
        return repository.findById(id)
                .map(project -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(project.getImageType() != null ? project.getImageType() : "image/jpeg"))
                        .body(project.getImageData()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Projects> addProject(@ModelAttribute ProjectRequest request){
        try {
            Projects newProject = service.addOrUpdateProject(null, request);
            return ResponseEntity.ok(newProject);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping(value = "/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Projects> UpdateProject(@PathVariable Long id, @ModelAttribute ProjectRequest request){
        try {
            Projects updatedProject = service.addOrUpdateProject(id, request);

            if (updatedProject != null) {
                return ResponseEntity.ok(updatedProject);
            } else {
                return ResponseEntity.notFound().build(); // Return 404 if project ID is missing
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id){
        service.deleteProjectById(id);
        return ResponseEntity.noContent().build();
    }
}