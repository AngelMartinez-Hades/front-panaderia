import { Cliente } from './cliente';

export interface Venta {
  id: number;
  fecha: string;        
  total: number;
  cliente: Cliente;
}
