package com.krupa.Dto;

import java.math.BigDecimal;
import java.util.Map;

public record DashboardMetricsDto(
        BigDecimal totalExpensesAllTime,
        BigDecimal todaysExpense,
        BigDecimal monthlyExpense,
        long activeProjectsCount,
        long completedProjectsCount,
        long totalFurnitureCount,
        Map<String, BigDecimal> expenseByCategory
) {}