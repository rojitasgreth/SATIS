import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { VisualizeClientComponent } from '../visualize-client/visualize-client.component';
import { environment } from 'src/environment/environment';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Color {
  value: number,
  label: string
}

@Component({
  selector: 'app-visualize-orden',
  templateUrl: './visualize-orden.component.html'
})
export class VisualizeOrdenComponent implements OnInit {
  orden: any;
  productos: any;
  clienteFinal: any;
  constructor(private router: Router, private cdr: ChangeDetectorRef, private _matDialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    this.consultarOrden();
    this.consultarProductos();
    localStorage.removeItem('editProduct');
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
  };


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

  visualizarDatosCliente() {
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

  borrarProd(item: any) {
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
  };

  finalizarOrden() {
    if (this.productos !== null) {
      Swal.fire({
        icon: 'warning',
        title: '¿Desea finalizar la orden?',
        text: 'Verifique haber agregado todos los productos, ya que después no los podrá agregar a esta misma orden.',
        confirmButtonText: 'Si, finalizar',
        confirmButtonColor: '#28B463',
        showConfirmButton: true,
        cancelButtonColor: '#E74C3C',
        cancelButtonText: 'Cancelar',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          const clienteString = localStorage.getItem('orden');
          const infoString = localStorage.getItem('info')
          if (clienteString !== null && infoString !== null) {
            const cliente = JSON.parse(clienteString);
            const info = JSON.parse(infoString);

            this.clienteFinal = {
              id_cliente: cliente.id,
              id_usuario: info.id,
              vendedor: info.primer_nombre + ' ' + info.primer_apellido,
              nombre: cliente.cliente,
              RIF: cliente.RIF,
              estado: cliente.estado,
              calle: cliente.calle,
              edificio: cliente.edificio,
              condicion: cliente.Condicion,
              tipo_envio: cliente.tipo_envio,
              email: cliente.email,
              correo: true
            };

            Swal.fire({
              icon: 'warning',
              title: '¿Desea enviar la orden de compra?',
              text: 'Puede realizar el envío en este momento o más tarde desde el inicio: Abriendo el detalle del ticket de color amarillo.',
              confirmButtonText: 'Si, enviar en este momento.',
              confirmButtonColor: '#28B463',
              showConfirmButton: true,
              cancelButtonColor: '#E74C3C',
              cancelButtonText: 'No, enviar más tarde.',
              showCancelButton: true
            }).then((result) => {
              if (result.isConfirmed) {

                const data = {
                  cliente: this.clienteFinal,
                  detalle: this.productos
                }

                console.log(data);


                this.http.post(`${environment.BASE_URL_API}/insertarOrden`, data).subscribe(
                  (response: any) => {
                    if (response == 'Insercion correcta') {
                      console.log(response);
                      localStorage.removeItem('orden');
                      localStorage.removeItem('productos');
                      this.router.navigate(['/home']);

                    } else {
                      console.log('Error');
                    }
                  },
                  (error: any) => {
                    console.error("Error", error);
                  }
                );

              } else {
                this.clienteFinal.correo = false;
                const data = {
                  cliente: this.clienteFinal,
                  detalle: this.productos
                }

                this.http.post(`${environment.BASE_URL_API}/insertarOrden`, data).subscribe(
                  (response: any) => {
                    if (response == 'Insercion correcta') {
                      console.log(response);
                      localStorage.removeItem('orden');
                      localStorage.removeItem('productos');
                      this.router.navigate(['/home']);

                    } else {
                      console.log('Error');
                    }
                  },
                  (error: any) => {
                    console.error("Error", error);
                  }
                );
              }
            });

          } else {
            console.error('El objeto cliente almacenado en localStorage es nulo.');
          }

        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'No se ha seleccionado ningun producto',
        timer: 4000
      })
    }
  }

  editarOrden(item: any) {
    localStorage.setItem('editProduct', JSON.stringify(item));
    this.router.navigate(['editProduct']);

  }
}
