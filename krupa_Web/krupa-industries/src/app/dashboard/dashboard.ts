import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FurnitureService } from '../services/furniture';
import { RealEstateService } from '../services/real-estate';
import { forkJoin } from 'rxjs'; // 👈 Import forkJoin to sync background threads

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  totalFurnitureCount = 0;
  totalProjectCount = 0;
  activeProjectsCount = 0;
  totalFurnitureValue = 0;
  isLoading = true;

  constructor(
    private furnitureService: FurnitureService,
    private projectService: RealEstateService,
    private cdr: ChangeDetectorRef // 👈 Injected for instant UI synchronization
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.isLoading = true;

    // forkJoin executes both parallel HTTP streams and emits once both return data
    forkJoin({
      furniture: this.furnitureService.getAllFurniture(),
      projects: this.projectService.getAllProjects()
    }).subscribe({
      next: (result: any) => {
        // Safe Parse Furniture Arrays
        if (result.furniture && Array.isArray(result.furniture)) {
          this.totalFurnitureCount = result.furniture.length;
          this.totalFurnitureValue = result.furniture.reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0);
        }

        // Safe Parse Real Estate Arrays
        if (result.projects && Array.isArray(result.projects)) {
          this.totalProjectCount = result.projects.length;
          this.activeProjectsCount = result.projects.filter((p: any) => p.status === 'ACTIVE').length;
        }

        this.isLoading = false;
        this.cdr.detectChanges(); // 👈 Forces the UI to paint immediately
      },
      error: (err: any) => {
        console.error('Dashboard telemetry link failed:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}