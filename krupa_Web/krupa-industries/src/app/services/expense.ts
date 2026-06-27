import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Expense {
  id?: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  projectId: number;      // 👈 Binds during creation form submits
  projectTitle?: string;   // 👈 Returned from server to print on tables
  projectStatus?: string;  // 👈 Used for view-filtering toggles ('ACTIVE' vs 'COMPLETED')
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:8080/api/expenses';

  constructor(private http: HttpClient) {}

  getAllExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/all`);
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/add`, expense);
  }

  deleteExpense(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

}