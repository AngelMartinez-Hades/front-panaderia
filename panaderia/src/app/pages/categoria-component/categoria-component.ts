import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../_services/categoria-service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-categoria-component',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatTooltipModule

  ],
  templateUrl: './categoria-component.html',
styleUrls: ['./categoria-component.css']
})
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  categoria: Categoria = {
    id: 0,
    nombre: '',
    descripcion: ''
  };
  isEditing = false;

  constructor(private categoriaService: CategoriaService) {}

    ngOnInit(): void {
    this.cargarCategorias();
  }
  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data) => {
        console.log('✅ Categorías recibidas:', data);
        this.categorias = data;
      },
      error: (err) => {
        console.error('❌ Error al obtener categorías:', err);
      }
    });
  }

  guardarCategoria(): void {
    if (this.isEditing) {
      this.categoriaService.actualizar(this.categoria.id, this.categoria).subscribe(
        () => {
          this.cargarCategorias();
          this.limpiarFormulario();
        }
      );
    } else {
      this.categoriaService.crear(this.categoria).subscribe(
        () => {
          this.cargarCategorias();
          this.limpiarFormulario();
        }
      );
    }
  }

  editarCategoria(categoria: Categoria): void {
    this.categoria = { ...categoria };
    this.isEditing = true;
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Está seguro de eliminar esta categoría?')) {
      this.categoriaService.eliminar(id).subscribe(
        () => this.cargarCategorias()
      );
    }
  }

verDetalle(categoria: Categoria): void {
  alert(`ID: ${categoria.id}\nNombre: ${categoria.nombre}\nDescripción: ${categoria.descripcion}`);
}
  limpiarFormulario(): void {
    this.categoria = {
      id: 0,
      nombre: '',
      descripcion: ''
    };
    this.isEditing = false;
  }
}
