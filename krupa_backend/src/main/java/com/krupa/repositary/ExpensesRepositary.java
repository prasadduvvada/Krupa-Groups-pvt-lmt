package com.krupa.repositary;

import com.krupa.model.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpensesRepositary extends JpaRepository<Expenses, Long> {

    // 1. FIXED: Changed 'Expense' to 'Expenses'
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expenses e")
    BigDecimal sumAllExpenses();

    // 2. FIXED: Changed 'Expense' to 'Expenses'
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expenses e WHERE e.date = :date")
    BigDecimal sumExpensesByDate(@Param("date") LocalDate date);

    // 3. FIXED: Changed 'Expense' to 'Expenses'
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expenses e WHERE e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumExpensesByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // 4. FIXED: Changed 'Expense' to 'Expenses'
    @Query("SELECT e.category, SUM(e.amount) FROM Expenses e GROUP BY e.category")
    List<Object[]> getExpenseSummaryByCategory();
}