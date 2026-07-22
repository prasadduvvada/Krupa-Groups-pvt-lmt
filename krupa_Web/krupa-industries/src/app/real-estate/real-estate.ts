import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RealEstateService } from '../services/real-estate';
import { AuthService } from '../auth.service';
import imageCompression from 'browser-image-compression';

export interface Project {
  id?: number;
  title: string;
  type: string;
  status: string;
  priceText: string;
  shortDescription: string;
  fullDetails?: string;
}


@Component({
  selector: 'app-real-estate',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './real-estate.html',
  styleUrls: ['./real-estate.css']
})
export class RealEstateComponent implements OnInit {
  projectList: Project[] = [];
  projectForm!: FormGroup;
  currentTab: string = 'COMPLETED';

  isModalOpen = false;
  isEditMode = false;
  currentEditingId: number | null = null;
  selectedFile: File | null = null;
  isLoading = false;

  // 💡 FIXED: Track which project card is expanded down to show full details
  expandedProjectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private projectService: RealEstateService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllProjects();
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      priceText: ['', Validators.required],
      shortDescription: ['', Validators.required],
      fullDetails: ['']
    });
  }

  loadAllProjects(): void {
    this.isLoading = true;
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        this.projectList = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error fetching real estate streams:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 💡 FIXED: Click method to toggle card expansion frames open and closed
  toggleExpandCard(id: number | undefined): void {
    if (!id) return;
    this.expandedProjectId = this.expandedProjectId === id ? null : id;
    this.cdr.detectChanges();
  }

  async onFileSelected(event: any): Promise<void> {
    const rawFile: File = event.target.files[0];
    if (rawFile && rawFile.type.startsWith('image/')) {
      try {
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true };
        this.selectedFile = (await imageCompression(rawFile, options)) as File;
      } catch (error) {
        console.error('Compression failed:', error);
        this.selectedFile = rawFile;
      }
    }
  }

  getImageUrl(id: number | undefined): string {
    return id ? `https://krupa-groups-pvt-lmt.onrender.com/api/projects/${id}/image` : 'assets/placeholder.jpg';
  }

  onSaveProject(): void {
    if (this.projectForm.invalid) return;

    const formData = new FormData();
    formData.append('title', this.projectForm.get('title')?.value);
    formData.append('type', this.projectForm.get('type')?.value);
    formData.append('status', this.projectForm.get('status')?.value);
    formData.append('priceText', this.projectForm.get('priceText')?.value);
    formData.append('shortDescription', this.projectForm.get('shortDescription')?.value);
    formData.append('fullDetails', this.projectForm.get('fullDetails')?.value || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    const request$ =
      this.isEditMode && this.currentEditingId !== null
        ? this.projectService.updateProject(this.currentEditingId, formData)
        : this.projectService.addProject(formData);

    request$.subscribe({
      next: () => {
        this.closeModal();
        this.loadAllProjects();
      },
      error: (err: any) => console.error('Save operation failed:', err)
    });
  }

  onDeleteProject(id: number | undefined): void {
    if (!id || !confirm('Are you sure you want to delete this property?')) return;
    this.projectService.deleteProject(id).subscribe({
      next: () => this.loadAllProjects(),
      error: (err: any) => console.error('Deletion failed:', err)
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentEditingId = null;
    this.selectedFile = null;
    this.projectForm.reset({ status: 'ACTIVE' });
    this.isModalOpen = true;
  }

  openEditModal(project: Project): void {
    this.isEditMode = true;
    this.currentEditingId = project.id ?? null;
    this.selectedFile = null;
    this.isModalOpen = true;
    this.projectForm.patchValue(project);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.projectForm.reset();
    this.selectedFile = null;
  }
}