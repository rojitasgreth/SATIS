import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environment/environment';
import { MatDialog } from "@angular/material/dialog";
import { VisualizeClientComponent } from '../visualize-client/visualize-client.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

interface Color {
  value: number;
  label: string;
}

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-prodcut.component.html'
})
export class EditProdcutComponent implements OnInit {
  producto: any;
  listaColores: Color[] = [];
  generoSeleccionado: string = '';
  colorInicial: string = '';
  colorSeleccionado: Color = { value: 0, label: '' };
  cantidad: number = 0;


  constructor(private http: HttpClient, private _matDialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    let dato = localStorage.getItem('editProduct');
    if (dato !== null) {
      this.producto = JSON.parse(dato);
      this.generoSeleccionado = this.producto.genero;
      this.colorInicial = this.producto.cod_color;
      this.colorSeleccionado = this.producto.cod_color;
      this.cantidad = this.producto.cantidad;
      this.consultarColores(this.producto.cod_categoria, this.producto.genero);
    }
  }

  consultarColores(cod: string, genero: string) {
    const data = {
      "cod_categoria": cod,
      "genero": genero
    };

    this.http.post(`${environment.BASE_URL_API}/listarColores`, data).subscribe(
      (response: any) => {
        if (response !== 'VACIO') {
          this.listaColores = response.map((dato: any) => ({ value: dato.codigo_color, label: dato.descripcion_color }));
        } else {
          this.listaColores = [];
        }
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
  }

  editar() {

    if (this.colorSeleccionado.value !== undefined && this.cantidad !== null) {
      let data = {
        cantidad: this.cantidad,
        cantidad_piezas: this.producto.cantidad_piezas,
        categoria_producto: this.producto.categoria_producto,
        cod_categoria: this.producto.cod_categoria,
        cod_color: this.colorSeleccionado.value,
        color: this.colorSeleccionado.label,
        descripcion_producto: this.producto.descripcion_producto,
        genero: this.producto.genero,
        precio: this.producto.precio
      };
      console.log(data);

      let change = localStorage.getItem('productos');

      if (change !== null) {
        let productos = JSON.parse(change);

        function actualizarProducto(productos: any, data: any, color:any) {
          console.log(productos, color);

          // Encuentra el objeto que coincida con los criterios
          let producto = productos.find((p:any) =>
              p.cod_categoria === data.cod_categoria &&
              p.categoria_producto === data.categoria_producto &&
              p.genero === data.genero &&
              p.cod_color === color

          );
          console.log(producto);

          // Si se encuentra el objeto, actualiza sus propiedades
          if (producto) {
              producto.cantidad = data.cantidad;
              producto.cantidad_piezas = data.cantidad_piezas;
              producto.cod_color = data.cod_color;
              producto.color = data.color;
              producto.descripcion_producto = data.descripcion_producto;
              producto.precio = data.precio;
          }
      }

      // Llama a la función para actualizar el producto
      actualizarProducto(productos, data, this.colorInicial);

      // Verifica el resultado
      console.log(productos);

      localStorage.setItem('productos', JSON.stringify(productos));
      localStorage.removeItem('editProduct');

      Swal.fire({
        title: 'Producto editado',
        icon: 'success',
        confirmButtonColor: '#0097A7'
      });

      this.router.navigate(['/visualize-orden']);

      }

    } else {
      Swal.fire({
        title: 'Por favor, complete los campos',
        icon: 'error',
        confirmButtonColor: '#0097A7'
      });
    }



  }

  visualizarDatosCliente() {
    const dialogRef = this._matDialog.open(VisualizeClientComponent, {
      panelClass: 'bg-white'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed', result);
    });
  }
}
