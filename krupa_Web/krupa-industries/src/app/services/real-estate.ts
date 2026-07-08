import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs'; // 💡 Added 'of' and 'tap' for caching operations

// The TypeScript interface matching your backend Project/Real Estate columns
export interface Project {
  id?: number;
  title: string;
  type: string;
  status: string;
  priceText: string;
  shortDescription: string;
  fullDetails: string;
  imageName?: string;
  imageType?: string;
  imageData?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RealEstateService {
  // Points directly to your running Spring Boot project endpoints
  private apiUrl = 'https://krupa-groups-pvt-lmt.onrender.com/api/projects';

  // 💡 THE CACHE ARRAY: Holds your real estate listings in your browser's active memory
  private cachedProjects: Project[] = [];

  constructor(private http: HttpClient) {}

  // 1. READ: Fetch all project profiles from PostgreSQL (With Instant Cache Layer)
  getAllProjects(forceRefresh = false): Observable<Project[]> {
    // If we have data cached and haven't forced a reload, serve it instantly!
    if (this.cachedProjects.length > 0 && !forceRefresh) {
      return of(this.cachedProjects);
    }

    // Otherwise, execute the background network call once and store the result
    return this.http.get<Project[]>(this.apiUrl).pipe(
      tap(data => this.cachedProjects = data)
    );
  }

  // 2. CREATE: Stream a multipart form-data block and wipe cache to include the new row
  addProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, formData).pipe(
      tap(() => this.clearCache()) // Drops stale cache data
    );
  }

  // 3. DELETE: Remove the project listing and update cache
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  // 4. UPDATE: Modify an existing project listing and refresh active cache tracking
  updateProject(id: number, formData: FormData): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, formData).pipe(
      tap(() => this.clearCache())
    );
  }

  // 💡 HELPER METHOD: Safely flushes frontend memory out when mutations complete
  clearCache(): void {
    this.cachedProjects = [];
  }
}