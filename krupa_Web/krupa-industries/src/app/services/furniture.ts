import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api/furniture';

  constructor(private http: HttpClient) {}

  // 🎯 FIXED: Changed path from '${this.apiUrl}/all' to match your clean @GetMapping
  getAllFurniture(): Observable<Furniture[]> {
    return this.http.get<Furniture[]>(this.apiUrl);
  }

  // 🎯 FIXED: Changed path from '${this.apiUrl}/add' to match your clean @PostMapping
  addFurniture(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  // 🔄 Matches your backend @PutMapping(value = "/{id}")
  updateFurniture(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  // 🗑️ Matches your backend @DeleteMapping("/{id}")
  deleteFurniture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}