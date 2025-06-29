import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../_services/categoria-service';
import { CategoriaModal } from './categoria-modal/categoria-modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

interface CategoriaModalData {
  categoria?: Categoria;
  modo: 'crear' | 'editar' | 'ver';
}

@Component({
  selector: 'app-categoria-component',
  templateUrl: './categoria-component.html',
  styleUrls: ['./categoria-component.css'],
  standalone: true,
  imports:[
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,  
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
  ]
})
export class CategoriaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  categorias: Categoria[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<Categoria>([]);
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoriaService: CategoriaService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarCategorias(): void {
    this.categoriaService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.configureTable();
        },
        error: (err) => {
          console.error('Error al obtener categorías:', err);
          this.showErrorToast('Error al cargar las categorías');
        }
      });
  }

  private configureTable(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    this.dataSource.sortingDataAccessor = (data: Categoria, sortHeaderId: string): string => {
      switch (sortHeaderId) {
        case 'id': return data.id.toString();
        case 'nombre': return data.nombre?.toLowerCase() || '';
        case 'descripcion': return data.descripcion?.toLowerCase() || '';
        default: return '';
      }
    };

    this.dataSource.filterPredicate = (data: Categoria, filter: string): boolean => {
      const searchStr = (
        (data.nombre || '') + ' ' + 
        (data.descripcion || '') + ' ' + 
        data.id
      ).toLowerCase();
      return searchStr.includes(filter.toLowerCase());
    };
  }

  aplicarFiltro(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abrirModal(modo: 'crear' | 'editar' | 'ver', categoria?: Categoria): void {
    const dialogRef = this.dialog.open(CategoriaModal, {
      width: '600px',
      data: { categoria, modo } as CategoriaModalData,
      ariaLabel: `${modo} categoría`,
      disableClose: modo === 'ver'
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          modo === 'crear' ? this.crearCategoria(result) : this.actualizarCategoria(result);
        }
      });
  }

  private showLoading(title: string): void {
    Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
  }

  private showSuccessAlert(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  private showErrorToast(message: string): void {
    this.toastr.error(message, 'Error', {
      timeOut: 3000,
      progressBar: true
    });
  }

  crearCategoria(categoria: Categoria): void {
    this.showLoading('Creando categoría...');
    
    this.categoriaService.crear(categoria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          Swal.close();
          this.cargarCategorias();
          this.showSuccessAlert('¡Éxito!', 'La categoría ha sido creada correctamente');
        },
        error: (err) => {
          console.error('Error al crear categoría:', err);
          Swal.close();
          this.showErrorToast('Error al crear la categoría');
        }
      });
  }

  actualizarCategoria(categoria: Categoria): void {
    this.showLoading('Actualizando categoría...');
    
    this.categoriaService.actualizar(categoria.id, categoria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          Swal.close();
          this.cargarCategorias();
          this.showSuccessAlert('¡Actualizado!', 'La categoría ha sido actualizada correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar categoría:', err);
          Swal.close();
          this.showErrorToast('Error al actualizar la categoría');
        }
      });
  }

  confirmarEliminar(categoria: Categoria): void {
    Swal.fire({
      title: '¿Estás seguro?',
      html: `¿Deseas eliminar la categoría <strong>"${categoria.nombre}"</strong>?<br>
             <small class="text-muted">Esta acción no se puede deshacer</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarCategoria(categoria.id);
      }
    });
  }

  eliminarCategoria(id: number): void {
    this.showLoading('Eliminando categoría...');
    
    this.categoriaService.eliminar(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          Swal.close();
          this.cargarCategorias();
          this.showSuccessAlert('¡Eliminado!', 'La categoría ha sido eliminada exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar categoría:', err);
          Swal.close();
          this.showErrorToast('No se pudo eliminar la categoría. Verifique que no esté siendo utilizada.');
        }
      });
  }

  refrescarTabla(): void {
    this.cargarCategorias();
    this.toastr.info('Datos actualizados', '', {
      timeOut: 2000
    });
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.aplicarFiltro();
  }
}