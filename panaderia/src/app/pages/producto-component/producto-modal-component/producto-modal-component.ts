import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Categoria } from '../../../models/categoria';
import { ProductoService } from '../../../_services/producto-service';
import { CategoriaService } from '../../../_services/categoria-service';
import { Producto } from '../../../models/producto';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-producto-modal-component',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './producto-modal-component.html',
  styleUrl: './producto-modal-component.css'
})

export class ProductoModalComponent {
  form: FormGroup;
  categorias: Categoria[] = [];
  esSoloLectura = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { accion: 'nuevo' | 'editar' | 'ver'; producto?: Producto },
    private dialogRef: MatDialogRef<ProductoModalComponent>,
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [null, Validators.required]
    });

    this.esSoloLectura = data.accion === 'ver';

    if (data.producto) {
      this.form.patchValue(data.producto);
    }

    if (this.esSoloLectura) {
      this.form.disable();
    }

    this.categoriaService.listar().subscribe({
      next: cats => this.categorias = cats
    });
  }

guardar(): void {
  if (this.form.invalid || this.esSoloLectura) return;

  const producto = this.form.value as Producto;

  const peticion = this.data.accion === 'editar'
    ? this.productoService.actualizar(this.data.producto!.id, producto)
    : this.productoService.crear(producto);

peticion.subscribe({
  next: () => {
    this.dialogRef.close('guardado');
  },
  error: () => this.toastr.error('Ocurrió un error al guardar el producto', 'Error')
});
}

  cerrar(): void {
    this.dialogRef.close();
  }
}



