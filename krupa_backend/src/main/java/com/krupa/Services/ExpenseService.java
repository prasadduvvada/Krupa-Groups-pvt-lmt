package com.krupa.Services;

import com.krupa.Dto.ExpensesRequest;
import com.krupa.Dto.ExpensesResponses;
import com.krupa.model.Expenses;
import com.krupa.model.Projects;
import com.krupa.repositary.ExpensesRepositary;
import com.krupa.repositary.ProjectRepositary; // 👈 Import your Project repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpensesRepositary repo;

    @Autowired
    private ProjectRepositary projectRepo; // 👈 1. Injected to look up parent project records

    public ExpensesResponses saveExpenses(ExpensesRequest requestData) {

        Expenses expenses = new Expenses();

        if(requestData.date() != null && !requestData.date().isEmpty()){
            expenses.setDate(LocalDate.parse(requestData.date()));
        }
        else{
            expenses.setDate(LocalDate.now());
        }
        expenses.setDescription(requestData.description());
        expenses.setCategory(requestData.category());
        expenses.setAmount(requestData.amount());
        expenses.setPaymentMethod(requestData.paymentMethod());

        // 2. Fetch the corresponding project row from database via requested ID
         Projects project = projectRepo.findById(requestData.projectId())
                .orElseThrow(() -> new RuntimeException("Target project node not found with ID: " + requestData.id()));

        expenses.setProject(project); // 👈 3. Binds the expense entry line to this project entity

        Expenses savedExpenses = repo.save(expenses);

        // 4. Return response carrying parent project properties back to Angular
        return new ExpensesResponses(
                savedExpenses.getId(),
                savedExpenses.getDate() != null ? savedExpenses.getDate().toString() : null,
                savedExpenses.getDescription(),
                savedExpenses.getCategory(),
                savedExpenses.getAmount(),
                savedExpenses.getPaymentMethod(),
                savedExpenses.getProject().getTitle(),             // 👈 For frontend text display
                savedExpenses.getProject().getStatus().toString()  // 👈 For frontend ACTIVE/COMPLETED tab matching
        );
    }

    public List<ExpensesResponses> getAllExpenses() {
        List<Expenses> runningList = repo.findAll();

        return runningList.stream()
                .map(expense -> new ExpensesResponses(
                        expense.getId(),
                        expense.getDate() != null ? expense.getDate().toString() : null,
                        expense.getDescription(), // 💡 Fixed: Aligned parameter positioning order
                        expense.getCategory(),
                        expense.getAmount(),
                        expense.getPaymentMethod(),
                        expense.getProject() != null ? expense.getProject().getTitle() : "Unassigned Site",
                        expense.getProject() != null ? expense.getProject().getStatus().toString() : "ACTIVE"
                ))
                .collect(Collectors.toList());
    }

    public void deleteExpenseById(Long id) {
        repo.deleteById(id);
    }
}