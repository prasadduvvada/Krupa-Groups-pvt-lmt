package com.krupa.Services;

import com.krupa.Dto.DashboardMetricsDto;
import com.krupa.repositary.ExpensesRepositary;
import com.krupa.repositary.FurnitureRepositary;
import com.krupa.repositary.ProjectRepositary;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;

@Service // CRITICAL: Tells Spring Boot to manage this class as a bean
public class DashboardService {

    private final ExpensesRepositary expensesRepository;
    private final ProjectRepositary projectRepository;
    private final FurnitureRepositary furnitureRepository;

    // Dependency Injection Constructor matching your exact repository names
    public DashboardService(ExpensesRepositary expensesRepository,
                            ProjectRepositary projectRepository,
                            FurnitureRepositary furnitureRepository) {
        this.expensesRepository = expensesRepository;
        this.projectRepository = projectRepository;
        this.furnitureRepository = furnitureRepository;
    }

    public DashboardMetricsDto getDashboardMetrics() {
        LocalDate today = LocalDate.now();

        // Fetch baseline lists from your database entities
        var allExpenses = expensesRepository.findAll();
        var allProjects = projectRepository.findAll();

// 1. Calculate All-Time Expenses Total Sum
        BigDecimal totalExpensesAllTime = allExpenses.stream()
                .map(e -> e.getAmount() != null ? BigDecimal.valueOf(e.getAmount()) : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Calculate Today's Expenses Total Sum
        BigDecimal todaysExpense = allExpenses.stream()
                .filter(e -> e.getDate() != null && today.equals(e.getDate()))
                .map(e -> e.getAmount() != null ? BigDecimal.valueOf(e.getAmount()) : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Calculate Current Month's Expenses Total Sum
        BigDecimal monthlyExpense = allExpenses.stream()
                .filter(e -> e.getDate() != null
                        && e.getDate().getMonth() == today.getMonth()
                        && e.getDate().getYear() == today.getYear())
                .map(e -> e.getAmount() != null ? BigDecimal.valueOf(e.getAmount()) : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Calculate Real Estate Project State Metrics
        long activeProjectsCount = allProjects.stream()
                .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()))
                .count();

        long completedProjectsCount = allProjects.stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()))
                .count();

        // 5. Fetch Total Volume of Furniture Catalog items
        long totalFurnitureCount = furnitureRepository.count();

        // 6. Aggregate Expenses by Category map for the Chart display interface
        Map<String, BigDecimal> expenseByCategory = allExpenses.stream()
                .filter(e -> e.getCategory() != null && e.getAmount() != null)
                .collect(Collectors.groupingBy(
                        e -> e.getCategory(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                e -> BigDecimal.valueOf(e.getAmount()),
                                BigDecimal::add
                        )
                ));

        // Return the clean immutable Java record transfer package
        return new DashboardMetricsDto(
                totalExpensesAllTime,
                todaysExpense,
                monthlyExpense,
                activeProjectsCount,
                completedProjectsCount,
                totalFurnitureCount,
                expenseByCategory
        );
    }
}