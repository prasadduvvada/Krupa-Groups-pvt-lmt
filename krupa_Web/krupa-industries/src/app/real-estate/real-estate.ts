import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RealEstateService, Project } from '../services/real-estate';
import { AuthService } from '../auth.service';

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

  currentTab: 'ACTIVE' | 'COMPLETED' = 'ACTIVE';

  isModalOpen = false;
  isEditMode = false;
  currentEditingId: number | null = null;
  selectedFile: File | null = null;

  // 💡 THE LOADING TRIGGER: Monitors network data stream state
  isLoading = false;

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
    // 💡 Turn loader on before request goes over the cloud network
    this.isLoading = true;

    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        this.projectList = data;
        this.isLoading = false; // 💡 Turn loader off instantly when data arrives!
        this.cdr.detectChanges(); // Guarantees instant UI element sync
      },
      error: (err: any) => {
        console.error('Error fetching real estate data registry:', err);
        this.isLoading = false; // Ensure loader shuts down even if network drops
        this.cdr.detectChanges();
      }
    });
  }

  onDeleteProject(id: number | undefined): void {
    if (!id) return;
    if (confirm('⚠️ Structural Alert: Are you completely sure you want to delete this architectural listing? This cannot be undone.')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.projectList = this.projectList.filter(p => p.id !== id);
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error removing project landmark entry:', err)
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSaveProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

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

    if (this.isEditMode && this.currentEditingId !== null) {
      this.projectService.updateProject(this.currentEditingId, formData).subscribe({
        next: () => this.handleSuccess(),
        error: (err: any) => console.error('Error modifying property entry:', err)
      });
    } else {
      this.projectService.addProject(formData).subscribe({
        next: () => this.handleSuccess(),
        error: (err: any) => console.error('Error adding new project node:', err)
      });
    }
  }

  getImageUrl(id: number | undefined): string {
    return id ? `https://krupa-groups-pvt-lmt.onrender.com/api/projects/${id}/image` : 'assets/placeholder.jpg';
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

    this.projectForm.patchValue({
      title: project.title,
      type: project.type,
      status: project.status,
      priceText: project.priceText,
      shortDescription: project.shortDescription,
      fullDetails: project.fullDetails
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.projectForm.reset();
    this.selectedFile = null;
  }

  private handleSuccess(): void {
    this.closeModal();
    this.loadAllProjects();
  }
}