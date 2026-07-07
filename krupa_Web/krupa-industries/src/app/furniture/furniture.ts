import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FurnitureService, Furniture } from '../services/furniture';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-furniture',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './furniture.html',
  styleUrls: ['./furniture.css']
})
export class FurnitureComponent implements OnInit {
  furnitureList: Furniture[] = [];
  furnitureForm!: FormGroup;

  currentCategory: string = 'all';

  isModalOpen = false;
  isEditMode = false;
  currentEditingId: number | null = null;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private furnitureService: FurnitureService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAllFurniture();
  }

  initForm(): void {
    this.furnitureForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      modelNumber: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      dimensions: ['', Validators.required],
      woodType: ['', Validators.required]
    });
  }

  onDeleteFurniture(id: number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to drop this design item from warehouse stock sheets?')) {
      this.furnitureService.deleteFurniture(id).subscribe({
        next: () => {
          this.furnitureList = this.furnitureList.filter(f => f.id !== id);
        },
        // 🎯 FIXED: Explicit type added here to satisfy strict compiler checking
        error: (err: any) => console.error('Error dropping furniture specification row:', err)
      });
    }
  }

  loadAllFurniture(): void {
    this.furnitureService.getAllFurniture().subscribe({
      next: (data: any[]) => {
        this.furnitureList = data;
        this.cdr.detectChanges(); // Ensures UI refreshes immediately upon data arrival
      },
      error: (err: any) => console.error('Error fetching furniture catalog:', err)
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSaveFurniture(): void {
    if (this.furnitureForm.invalid) {
      this.furnitureForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.furnitureForm.get('name')?.value);
    formData.append('category', this.furnitureForm.get('category')?.value);
    formData.append('modelNumber', this.furnitureForm.get('modelNumber')?.value);
    formData.append('price', this.furnitureForm.get('price')?.value);
    formData.append('dimensions', this.furnitureForm.get('dimensions')?.value);
    formData.append('woodType', this.furnitureForm.get('woodType')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    if (this.isEditMode && this.currentEditingId !== null) {
      this.furnitureService.updateFurniture(this.currentEditingId, formData).subscribe({
        next: () => this.handleSuccess(),
        error: (err: any) => console.error('Error updating item:', err)
      });
    } else {
      this.furnitureService.addFurniture(formData).subscribe({
        next: () => this.handleSuccess(),
        error: (err: any) => console.error('Error adding item:', err)
      });
    }
  }

  getImageUrl(id: number | undefined): string {
    return id ? `https://krupa-groups-pvt-lmt.onrender.com/api/furniture/${id}/image` : 'assets/placeholder.jpg';
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentEditingId = null;
    this.selectedFile = null;
    this.furnitureForm.reset();
    this.isModalOpen = true;
  }

  openEditModal(item: Furniture): void {
    this.isEditMode = true;
    this.currentEditingId = item.id ?? null;
    this.selectedFile = null;
    this.isModalOpen = true;
    
    this.furnitureForm.patchValue({
      name: item.name,
      category: item.category,
      modelNumber: item.modelNumber,
      price: item.price,
      dimensions: item.dimensions,
      woodType: item.woodType
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.furnitureForm.reset();
    this.selectedFile = null;
  }

  private handleSuccess(): void {
    this.closeModal();
    this.loadAllFurniture();
  }
}