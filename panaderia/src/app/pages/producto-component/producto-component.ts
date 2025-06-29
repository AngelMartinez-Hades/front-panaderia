import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../_services/producto-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductoModalComponent } from './producto-modal-component/producto-modal-component';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../_services/categoria-service';
import { Categoria } from '../../models/categoria';

                
@Component({
  selector: 'app-producto-component',
  standalone: true,
  imports: [
             CommonModule,
            FormsModule,
            MatTableModule,
            MatPaginatorModule,
            MatButtonModule,
            MatIconModule,
            MatTooltipModule,
            MatInputModule,
            RouterModule,
            MatFormFieldModule
  ],
  templateUrl: './producto-component.html',
  styleUrl: './producto-component.css'
})
export class ProductoComponent  implements OnInit{

displayedColumns: string[] = ['numero', 'nombre', 'precio', 'stock', 'categoria', 'acciones'];
dataSource = new MatTableDataSource<Producto>();
categoriaId !: number;
 search: string = '';
categorias: Categoria[] = [];

@ViewChild(MatPaginator) paginator !: MatPaginator;
  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}


 ngOnInit(): void {
  this.cargarCategorias();
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.listar().subscribe({
      next: productos => {
        this.dataSource = new MatTableDataSource(productos);
        this.dataSource.paginator = this.paginator;
      },
      error: () => this.toastr.error('Error al cargar los productos')
    });
  }

    cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: cats => this.categorias = cats,
      error: () => this.toastr.error('Error al cargar categorías')
    });
  }

  obtenerNombreCategoria(id: number): string {
    const cat = this.categorias.find(c => c.id === id);
    return cat ? cat.nombre : 'Desconocido';
  }

   aplicarFiltro(): void {
    this.dataSource.filter = this.search.trim().toLowerCase();
  }


  /**
   * Llama la modal
   */
   abrirModal(accion: 'nuevo' | 'editar' | 'ver', producto?: Producto): void {
    const dialogRef = this.dialog.open(ProductoModalComponent, {
      disableClose: true,
      width: '500px',
      data: { accion, producto }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'guardado') {
        this.cargarProductos();
        this.toastr.success('Producto guardado correctamente');
      }
    });
  }

  confirmarEliminacion(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.productoService.eliminar(id).subscribe({
          next: () => {
            this.toastr.success('Producto eliminado');
            this.cargarProductos();
          },
          error: () => this.toastr.error('Error al eliminar el producto')
        });
      }
    });
  }

}
