import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpenseService, Expense } from '../services/expense';
import { RealEstateService, Project } from '../services/real-estate'; // 👈 Fetch project rows

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense.html',
  styleUrls: ['./expense.css']
})
export class ExpenseComponent implements OnInit {
  allExpenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  availableProjects: Project[] = [];
  expenseForm!: FormGroup;
  
  isModalOpen = false;
  currentFilterMode: 'ACTIVE' | 'COMPLETED' = 'ACTIVE'; // 👈 Defaults to active project lists on open

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private projectService: RealEstateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  initForm(): void {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      projectId: ['', Validators.required] // 👈 Project dropdown selector binding parameter
    });
  }

  loadInitialData(): void {
    // 1. Fetch available projects for dropdown selector mapping
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.availableProjects = projects;
        this.cdr.detectChanges();
      }
    });

    // 2. Fetch expenditures list and apply initial dashboard filters
    this.loadAllExpenses();
  }

  onDeleteExpense(id: number | undefined): void {
  if (!id) return;
  if (confirm('Are you sure you want to permanently erase this ledger entry financial voucher?')) {
    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        // Instantly force-reload financial state list
        this.loadAllExpenses();
      },
      error: (err) => console.error('Error deleting expense transaction:', err)
    });
  }
}

  loadAllExpenses(): void {
    this.expenseService.getAllExpenses().subscribe({
      next: (data) => {
        this.allExpenses = data;
        this.applyProjectStatusFilter(this.currentFilterMode);
      },
      error: (err) => console.error('Error fetching expenses registry:', err)
    });
  }

  // Toggles the view state between Active Sites and Completed Sites
  applyProjectStatusFilter(status: 'ACTIVE' | 'COMPLETED'): void {
    this.currentFilterMode = status;
    this.filteredExpenses = this.allExpenses.filter(
      expense => expense.projectStatus === status
    );
    this.cdr.detectChanges();
  }

  onSaveExpense(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    this.expenseService.addExpense(this.expenseForm.value).subscribe({
      next: () => {
        this.closeModal();
        this.loadAllExpenses(); // Reload and re-filter list automatically
      },
      error: (err) => console.error('Error registering expenditure voucher:', err)
    });
  }

  openAddModal(): void {
    this.expenseForm.reset({ date: new Date().toISOString().substring(0, 10) });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.expenseForm.reset();
  }
}