package com.krupa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "furnitures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Furniture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private String modelNumber;

    private BigDecimal price;

    public String imageName;
    public String imageType;

    @Lob
    @Column(name = "image_data")
    public byte[] imageData;

    private String dimensions;
    private String woodType;
}