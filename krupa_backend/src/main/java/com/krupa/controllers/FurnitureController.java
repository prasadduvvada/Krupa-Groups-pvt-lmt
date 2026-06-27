package com.krupa.controllers;


import com.krupa.Dto.FurnitureRequest;
import com.krupa.Services.FurnitureService;
import com.krupa.model.Furniture;
import com.krupa.repositary.FurnitureRepositary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/furniture") // Clean, dedicated module path
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class FurnitureController {

    @Autowired
    private FurnitureService service;

    private final FurnitureRepositary repository;
    public FurnitureController(FurnitureRepositary repository) { this.repository = repository; }

    @GetMapping
    public ResponseEntity<List<Furniture>> getAllFurniture() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getFurnitureImage(@PathVariable Long id) {
        return repository.findById(id)
                .map(furniture -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(furniture.getImageType() != null ? furniture.getImageType() : "image/jpeg"))
                        .body(furniture.getImageData()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Furniture> addFurniture(@ModelAttribute FurnitureRequest request) throws IOException {
        return ResponseEntity.ok(service.addOrUpdateFurniture(null, request));
    }

    @PutMapping(value = "/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Furniture> updateFurnitures(@PathVariable Long id,@ModelAttribute FurnitureRequest request){

        Furniture updatedFurniture = null;
        try {
            updatedFurniture = service.addOrUpdateFurniture(id,request);

            if(updatedFurniture != null){
                return ResponseEntity.ok(updatedFurniture);
            }else{
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFurniture(@PathVariable Long id){
        service.deleteFurnitureById(id);
        return ResponseEntity.noContent().build();
    }

}