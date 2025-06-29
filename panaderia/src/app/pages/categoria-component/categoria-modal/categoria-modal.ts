import { Component, Inject, OnInit } from '@angular/core';
import { Categoria } from '../../../models/categoria';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

export interface DialogData {
  modo: 'crear' | 'editar' | 'ver';
  categoria?: Categoria;
}

@Component({
  selector: 'app-categoria-modal',
  standalone:true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './categoria-modal.html',
  styleUrl: './categoria-modal.css'
})
export class CategoriaModal implements OnInit{
  categoriaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoriaModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', [Validators.maxLength(500)]]
    });

    // Si es modo 'ver', deshabilitar el formulario
    if (this.data.modo === 'ver') {
      this.categoriaForm.disable();
    }
  }

  ngOnInit(): void {
    if (this.data.categoria) {
      this.categoriaForm.patchValue({
        nombre: this.data.categoria.nombre,
        descripcion: this.data.categoria.descripcion || ''
      });
    }
  }

  getTitulo(): string {
    switch (this.data.modo) {
      case 'crear': return 'Nueva Categoría';
      case 'editar': return 'Editar Categoría';
      case 'ver': return 'Detalle de Categoría';
      default: return 'Categoría';
    }
  }

  getIcon(): string {
    switch (this.data.modo) {
      case 'crear': return 'add_circle';
      case 'editar': return 'edit';
      case 'ver': return 'visibility';
      default: return 'category';
    }
  }

  getColorIcon(): string {
    switch (this.data.modo) {
      case 'crear': return 'text-success';
      case 'editar': return 'text-warning';
      case 'ver': return 'text-info';
      default: return 'text-primary';
    }
  }

  isReadonly(): boolean {
    return this.data.modo === 'ver';
  }

  onCancelar(): void {
    this.dialogRef.close();
  }

  onGuardar(): void {
    if (this.categoriaForm.valid && this.data.modo !== 'ver') {
      const categoria: Categoria = {
        id: this.data.categoria?.id || 0,
        nombre: this.categoriaForm.value.nombre.trim(),
        descripcion: this.categoriaForm.value.descripcion?.trim() || ''
      };
      
      this.dialogRef.close(categoria);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.categoriaForm.markAllAsTouched();
    }
  }

  // Getters para facilitar la validación en el template
  get nombre() {
    return this.categoriaForm.get('nombre');
  }

  get descripcion() {
    return this.categoriaForm.get('descripcion');
  }

  getNombreError(): string {
    const nombreControl = this.nombre;
    if (nombreControl?.hasError('required')) {
      return 'El nombre es obligatorio';
    }
    if (nombreControl?.hasError('minlength')) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    if (nombreControl?.hasError('maxlength')) {
      return 'El nombre no puede exceder 100 caracteres';
    }
    return '';
  }

  getDescripcionError(): string {
    const descripcionControl = this.descripcion;
    if (descripcionControl?.hasError('maxlength')) {
      return 'La descripción no puede exceder 500 caracteres';
    }
    return '';
  }
}