import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  // 1. READ: Fetch all project profiles from PostgreSQL
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  // 2. CREATE: Stream a multipart form-data block to register a new project elevation
  addProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, formData);
  }

    deleteProject(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}

  // 3. UPDATE: Modify an existing project listing by passing its ID and updated Form Data
  updateProject(id: number, formData: FormData): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, formData);
  }



}