package com.krupa.Dto;

import org.springframework.web.multipart.MultipartFile;

public record ProjectRequest(
        String title,
        String type,
        String status,
        String priceText,
        String shortDescription,
        String fullDetails,
        MultipartFile image
) {
}
