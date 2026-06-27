package com.krupa.Services;

import com.krupa.Dto.ProjectRequest;
import com.krupa.model.Projects;
import com.krupa.repositary.ProjectRepositary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepositary repository;

    public Projects addOrUpdateProject(Long id, ProjectRequest request) throws IOException {
        Projects project;

        if (id == null) {
            // 1. ID is null -> Creating a brand-new project row
            project = new Projects();
            String test = request.title();
            System.out.println("project added :"+test);
        } else {
            // 2. ID provided -> Modifying an existing project row
            project = repository.findById(id).orElse(null);
            if (project == null) {
                return null; // Graceful return if the target ID doesn't exist
            }
        }

        // Map data directly using your immutable Java Record accessors
        project.setTitle(request.title());
        project.setType(request.type());
        project.setStatus(request.status() != null ? request.status() : "ACTIVE");
        project.setPriceText(request.priceText());
        project.setShortDescription(request.shortDescription());
        project.setFullDetails(request.fullDetails());

        // Process multipart image file stream if provided by the admin
        MultipartFile imageFile = request.image();
        if (imageFile != null && !imageFile.isEmpty()) {
            project.setImageName(imageFile.getOriginalFilename());
            project.setImageType(imageFile.getContentType());
            project.setImageData(imageFile.getBytes());
        }

        // Saves or updates automatically based on the entity instance state
        return repository.save(project);
    }

    public void deleteProjectById(Long id) {
        repository.deleteById(id);
    }
}
