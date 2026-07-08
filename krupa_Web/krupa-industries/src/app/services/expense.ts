import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs'; // 💡 Added 'of' and 'tap' for local memory caching

export interface Expense {
  id?: number;
  description: string;
  category: string;
  amount: number;
  date: string;
  projectId: number;      // Binds during creation form submits
  projectTitle?: string;   // Returned from server to print on tables
  projectStatus?: string;  // Used for view-filtering toggles ('ACTIVE' vs 'COMPLETED')
}

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'https://krupa-groups-pvt-lmt.onrender.com/api/expenses';

  // 💡 THE CACHE ARRAY: Holds your transactional logs in memory
  private cachedExpenses: Expense[] = [];

  constructor(private http: HttpClient) {}

  // Fetch accounting log sheets with instant caching protection layers
  getAllExpenses(forceRefresh = false): Observable<Expense[]> {
    // If tracking numbers are warm in state, render with zero latency
    if (this.cachedExpenses.length > 0 && !forceRefresh) {
      return of(this.cachedExpenses);
    }

    return this.http.get<Expense[]>(`${this.apiUrl}/all`).pipe(
      tap(data => this.cachedExpenses = data)
    );
  }

  // CREATE: Inject new balance line and flush old cached records
  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/add`, expense).pipe(
      tap(() => this.clearCache())
    );
  }

  // DELETE: Wipe targeted item log row and signal necessary reload rules
  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  // 💡 HELPER METHOD: Flushes frontend memory array out completely
  clearCache(): void {
    this.cachedExpenses = [];
  }
}