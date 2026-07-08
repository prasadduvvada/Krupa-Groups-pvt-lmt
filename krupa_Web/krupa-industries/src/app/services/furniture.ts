import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs'; // 💡 Added 'of' and 'tap' for local memory caching

export interface Furniture {
  id?: number;
  name: string;
  category: string;
  modelNumber: string;
  price: number;
  dimensions: string;
  woodType: string;
}

@Injectable({
  providedIn: 'root'
})
export class FurnitureService {
  private apiUrl = 'https://krupa-groups-pvt-lmt.onrender.com/api/furniture';

  // 💡 THE CACHE ARRAY: Holds your catalog records in memory
  private cachedFurniture: Furniture[] = [];

  constructor(private http: HttpClient) {}

  // Fetch all furniture with instant active caching layer
  getAllFurniture(forceRefresh = false): Observable<Furniture[]> {
    // If cache is filled and refresh isn't forced, load instantly!
    if (this.cachedFurniture.length > 0 && !forceRefresh) {
      return of(this.cachedFurniture);
    }

    // Otherwise, hit the API network and save the stream results
    return this.http.get<Furniture[]>(this.apiUrl).pipe(
      tap(data => this.cachedFurniture = data)
    );
  }

  // CREATE: Register new item and dump stale cache records
  addFurniture(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData).pipe(
      tap(() => this.clearCache())
    );
  }

  // UPDATE: Modify catalog details and drop old cache entries
  updateFurniture(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(() => this.clearCache())
    );
  }

  // DELETE: Erase furniture column item and prompt data refresh
  deleteFurniture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  // 💡 HELPER METHOD: Flushes frontend memory array out completely
  clearCache(): void {
    this.cachedFurniture = [];
  }
}