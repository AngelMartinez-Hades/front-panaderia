import { Routes } from '@angular/router';
import { CategoriaComponent } from './pages/categoria-component/categoria-component';
import { ProductoComponent } from './pages/producto-component/producto-component';

export const routes: Routes = [
{
    path: 'categorias',
    component: CategoriaComponent,
    title: 'Gestión de Categorías'
},
{
    path: 'productos',
    component: ProductoComponent,
    title: 'Gestión de productos'
}

];
