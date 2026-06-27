package com.krupa.Services;

import com.krupa.Dto.FurnitureRequest;
import com.krupa.Dto.ProjectRequest;
import com.krupa.model.Furniture;
import com.krupa.model.Projects;
import com.krupa.repositary.FurnitureRepositary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FurnitureService {

    @Autowired
    private FurnitureRepositary repositary;

    public Furniture addOrUpdateFurniture(Long id, FurnitureRequest request) throws IOException {
        Furniture furniture;

        if (id == null) {
            // 1. ID is null -> Create a fresh instance for a new database row
            furniture = new Furniture();


        } else {
            // 2. ID exists -> Lookup the target row to modify
            furniture = repositary.findById(id).orElse(null);
            if (furniture == null) {
                return null; // Safety return if the requested record doesn't exist
            }
        }

        // Map the properties directly out of your modern Java Record accessors
        furniture.setName(request.name());
        furniture.setCategory(request.category());
        furniture.setModelNumber(request.modelNumber());
        furniture.setPrice(request.price());
        furniture.setDimensions(request.dimensions());
        furniture.setWoodType(request.woodType());


        // Process and unpack the multipart file upload chunk stream if the admin provided one
        MultipartFile imageFile = request.image();
        if (imageFile != null && !imageFile.isEmpty()) {
            furniture.setImageName(imageFile.getOriginalFilename());
            furniture.setImageType(imageFile.getContentType());
            furniture.setImageData(imageFile.getBytes());
        }

        // Save method handles both SQL INSERTs and UPDATEs automatically based on the presence of an active entity state
        return repositary.save(furniture);

    }

    public void deleteFurnitureById(Long id) {
        repositary.deleteById(id);
    }
}
