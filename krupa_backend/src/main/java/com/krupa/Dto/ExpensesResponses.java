
package com.krupa.Dto;

public record ExpensesResponses(
        Long id,
        String date,
        String description,
        String category,
        double amount,
        String paymentMethod,
        String projectTitle,
        String projectStatus
) {}