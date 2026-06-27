package com.krupa.Dto;


public record ExpensesRequest (
     Long id,
     String date,
     String category,
     String description,
     Double amount,
     String paymentMethod,
     Long projectId
){
}
