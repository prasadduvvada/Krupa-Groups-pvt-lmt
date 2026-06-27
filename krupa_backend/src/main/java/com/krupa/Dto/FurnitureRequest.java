package com.krupa.Dto;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public record FurnitureRequest(
        String name,
        String category,
        String modelNumber,
        BigDecimal price,
        String dimensions,
        String woodType,
        MultipartFile image

) {
}
