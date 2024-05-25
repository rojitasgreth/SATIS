import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { VisualizeClientComponent } from '../visualize-client/visualize-client.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-visualize-orden',
  templateUrl: './visualize-orden.component.html'
})
export class VisualizeOrdenComponent implements OnInit {
  orden: any;
  productos: any;
  constructor(private router: Router, private cdr: ChangeDetectorRef, private _matDialog: MatDialog) { }

  ngOnInit(): void {
    this.consultarOrden();
    this.consultarProductos();
  }

  consultarOrden() {
    const clienteString = localStorage.getItem('orden');
    if (clienteString !== null) {
      this.orden = JSON.parse(clienteString);
      console.log(this.orden);

    } else {
      this.router.navigate(['/home']);
    }
    this.cdr.detectChanges();
  }

  consultarProductos() {
    const productoString = localStorage.getItem('productos');
    if (productoString !== null) {
      this.productos = JSON.parse(productoString);
      console.log(this.productos);

    } else {
      this.productos = null;
    }
  }

  cancelarOrden() {
    Swal.fire({
      icon: 'warning',
      title: '¿Está seguro de que desea cancelar la orden?',
      text: 'Al realizar esta acción no podrá recuperar la información',
      showConfirmButton: true,
      confirmButtonText: 'Si, cancelar orden',
      confirmButtonColor: '#0097A7',
      showCancelButton: true,
      cancelButtonText: 'No, volver'
    }).then((result) => {
      if (result.isConfirmed) {
        const productoString = localStorage.getItem('productos');
        if (productoString !== null) {
          localStorage.removeItem('productos');
        }

        const clienteString = localStorage.getItem('orden');
        if (clienteString !== null) {
          localStorage.removeItem('orden');
        }

        Swal.fire({
          title: 'Orden cancelada',
          icon: 'info',
          showConfirmButton: false,
          showCancelButton: false,
          timer: 3000
        })

        this.router.navigate(['/home']);
      }
    });
  }

  visualizarDatosCliente(){
    const dialogRef = this._matDialog.open(VisualizeClientComponent, {
      panelClass: 'bg-white'
    });

        dialogRef.afterClosed().subscribe((result) => {
          console.log('holaa');

        });
  }
  objetosSonIguales(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        if (typeof val1 === 'object' && typeof val2 === 'object') {
            if (!this.objetosSonIguales(val1, val2)) {
                return false;
            }
        } else if (val1 !== val2) {
            return false;
        }
    }

    return true;
}

  borrarProd(item: any){
    console.log(item);

    Swal.fire({
      title: '¿Está seguro desea eliminar este producto?',
      showConfirmButton: true,
      confirmButtonText: 'Si, eliminar',
      confirmButtonColor: '28B463',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productos = this.productos.filter((producto: any) => !this.objetosSonIguales(producto, item));
        console.log(this.productos);
        localStorage.setItem('productos', JSON.stringify(this.productos));
      }
    });


  }
}
