import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FurnitureService, Furniture } from '../services/furniture';
import { AuthService } from '../auth.service';
import imageCompression from 'browser-image-compression'; // 💡 Added image compression engine

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
  currentCategory: string = 'all';
  selectedFile: File | null = null;
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
    this.isLoading = true;
    this.furnitureService.getAllFurniture().subscribe({
      next: (data: Furniture[]) => {
        this.furnitureList = data;
        this.isLoading = false; 
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error compiling furniture data catalogue streams:', err);
        this.isLoading = false; 
        this.cdr.detectChanges();
      }
    });
  }

  // 💡 UPGRADED: Intercepts wholesale item photos and applies client-side compression
  async onFileSelected(event: any): Promise<void> {
    const rawFile: File = event.target.files[0];
    
    if (rawFile) {
      if (rawFile.type.startsWith('image/')) {
        try {
          const options = {
            maxSizeMB: 0.5,           // 💡 Keeps file sizes under 500KB
            maxWidthOrHeight: 1920,   
            useWebWorker: true        
          };
          
          this.selectedFile = await imageCompression(rawFile, options) as File;
          console.log(`[Furniture] Compressed: ${(rawFile.size / 1024).toFixed(1)} KB ➡️ ${(this.selectedFile.size / 1024).toFixed(1)} KB`);
        } catch (error) {
          console.error('Compression failed, falling back to raw asset:', error);
          this.selectedFile = rawFile;
        }
      } else {
        this.selectedFile = rawFile;
      }
    }
  }

  getImageUrl(id: number | undefined): string {
    return id ? `https://krupa-groups-pvt-lmt.onrender.com/api/furniture/${id}/image` : 'assets/placeholder.jpg';
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
        error: (err: any) => console.error('Error updating stock inventory indices:', err)
      });
    } else {
      this.furnitureService.addFurniture(formData).subscribe({
        next: () => this.handleSuccess(),
        error: (err: any) => console.error('Error creating wholesale furniture mapping entries:', err)
      });
    }
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

  openAddModal(): void {
    this.isEditMode = false;
    this.currentEditingId = null;
    this.selectedFile = null; 
    this.furnitureForm.reset({ price: 0 });
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