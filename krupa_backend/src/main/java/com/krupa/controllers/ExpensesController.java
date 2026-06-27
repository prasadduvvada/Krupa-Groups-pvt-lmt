package com.krupa.controllers;

import com.krupa.Dto.ExpensesRequest;
import com.krupa.Dto.ExpensesResponses;
import com.krupa.Services.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ExpensesController {

    @Autowired
    private ExpenseService service;

    @PostMapping("/add")
    public ResponseEntity<ExpensesResponses> addExpenses(@RequestBody ExpensesRequest requestData){

        ExpensesResponses responses = service.saveExpenses(requestData);
        return new ResponseEntity<>(responses , HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ExpensesResponses>> getAllExpenses() {
        List<ExpensesResponses> expressionsList = service.getAllExpenses();
        return ResponseEntity.ok(expressionsList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        service.deleteExpenseById(id);
        return ResponseEntity.noContent().build();
    }


}
