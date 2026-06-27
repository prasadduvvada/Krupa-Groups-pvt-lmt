package com.krupa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Projects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String type;
    private String status;
    private String priceText;
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String fullDetails;

    public String imageName;
    public String imageType;

    @Lob
    @Column(name = "image_data")
    public byte[] imageData;
}