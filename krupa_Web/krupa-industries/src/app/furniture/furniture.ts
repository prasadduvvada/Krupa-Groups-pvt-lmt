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

  isModalOpen = false;
  isEditMode = false;
  currentEditingId: number | null = null;

  // 💡 THE LOADING TRIGGER: Synchronizes active shimmer visibility
  isLoading = false;

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
      price: [0, [Validators.required, Validators.min(1)]],
      dimensions: ['', Validators.required],
      woodType: ['', Validators.required]
    });
  }

  loadAllFurniture(): void {
    // 💡 Active network loading overlay state true
    this.isLoading = true;

    this.furnitureService.getAllFurniture().subscribe({
      next: (data: Furniture[]) => {
        this.furnitureList = data;
        this.isLoading = false; // 💡 Shuts loading state down when data lands
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error compiling furniture data catalogue streams:', err);
        this.isLoading = false; // Safety fallback reset
        this.cdr.detectChanges();
      }
    });
  }

  onDeleteFurniture(id: number | undefined): void {
    if (!id) return;
    if (confirm('⚠️ Catalogue Alert: Are you sure you want to completely erase this product model from the database listings?')) {
      this.furnitureService.deleteFurniture(id).subscribe({
        next: () => {
          this.furnitureList = this.furnitureList.filter(f => f.id !== id);
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error removing inventory catalog object node:', err)
      });
    }
  }

  onSaveFurniture(): void {
    if (this.furnitureForm.invalid) {
      this.furnitureForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.currentEditingId !== null) {
      this.furnitureService.updateFurniture(this.currentEditingId, this.furnitureForm.value).subscribe({
        next: () => this.handleSuccess(),
        error: (err: any) => console.error('Error updating stock inventory indices:', err)
      });
    } else {
      this.furnitureService.addFurniture(this.furnitureForm.value).subscribe({
        next: () => this.handleSuccess(),
        error: (err: any) => console.error('Error creating wholesale furniture mapping entries:', err)
      });
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentEditingId = null;
    this.furnitureForm.reset({ price: 0 });
    this.isModalOpen = true;
  }

  openEditModal(item: Furniture): void {
    this.isEditMode = true;
    this.currentEditingId = item.id ?? null;
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
  }

  private handleSuccess(): void {
    this.closeModal();
    this.loadAllFurniture();
  }
}