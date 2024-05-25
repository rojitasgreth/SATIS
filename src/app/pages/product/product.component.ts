import { HttpBackend, HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtherService } from 'src/app/services/other.service';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';

interface Color {
  value: number,
  label: string
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  cod: any;
  orden: any;
  listaColores: Color[] = [];
  producto: any;
  generoSeleccionado: any;
  clienteFinal: any;
  //colores: any[] = [];
  colorSeleccionado: any;
  coloresSeleccionados: { genero: string, categoria_producto: string, descripcion_producto: string, cantidad_piezas: string, precio: string, cod_color: number, color:string, cantidad: number, cod_categoria: string }[] = [];
  coloresMostrar: { genero: string, color: Color, cantidad: number }[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef, private service: OtherService, private router: Router) { }
  ngOnInit(): void {
    this.service.setOrden();
    this.service.orden$.subscribe(data => {
      this.orden = data;
    });
    this.cargarProductosSeleccionados();
    this.route.params.subscribe(params => {
      this.cod = params['cod'];
      this.consultarProducto(this.cod);
    });
  }

  cargarProductosSeleccionados() {
    const productosString = localStorage.getItem('productos');
    if (productosString) {
      this.coloresSeleccionados = JSON.parse(productosString);
    }
  }

  consultarProducto(cod: any) {
    const data = { "Condicion": this.orden.Condicion, "Envio": this.orden.tipo_envio, "Codigo": cod };
    this.http.post(`${environment.BASE_URL_API}/listarProductoIndividual`, data).subscribe(
      (response: any) => {
        if (response !== 'VACIO') {
          //console.log(response, 'producto');

          this.producto = response[0];
        } else {
          //console.log('Error');
        }
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
  }

  consultarColores(cod: string, genero: string) {
    const data = {
      "cod_categoria": cod,
      "genero": genero
    };

    this.generoSeleccionado = genero;

    //console.log(this.generoSeleccionado, 'es estoo');


    this.http.post(`${environment.BASE_URL_API}/listarColores`, data).subscribe(
      (response: any) => {
        if (response !== 'VACIO') {
          //console.log(response);

          this.listaColores = response.map((dato: any) => ({ value: dato.codigo_color, label: dato.descripcion_color }));
        } else {
          //console.log('Error');
        }
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
  }

  nuevoColor(event: any) {
    const value = event?.target?.value;

    if (value && this.generoSeleccionado) {
      this.colorSeleccionado = this.listaColores.find(color => value == color.value);

      //console.log(this.colorSeleccionado, 'que es estooo');


      if (this.colorSeleccionado) {
        console.log(this.colorSeleccionado, 'que tieneee');
        console.log(this.producto, 'prodcutooo');


        this.coloresSeleccionados.push({
          genero: this.generoSeleccionado,
          categoria_producto: this.producto.categoria,
          descripcion_producto: this.producto.descripcion,
          cantidad_piezas: this.producto.cantidad_piezas,
          precio: this.producto.precio,
          cod_color: this.colorSeleccionado.value,
          color: this.colorSeleccionado.label,
          cantidad: 0,
          cod_categoria: this.producto.cod_categoria
        });

        this.coloresMostrar.push({
          genero: this.generoSeleccionado,
          color: this.colorSeleccionado,
          cantidad: 0
        });
        //console.log(this.coloresSeleccionados, 'este es el color seleccionado');
      } else {
        console.log('No se ha seleccionado ningún color.');
      }
    } else {
      console.log('No se ha seleccionado ningún color o género.');
    }
  }

  agregarCantidad(cod: any, cantidad: any) {
    console.log(cod, cantidad, 'esto se recibe');

    console.log(this.producto);

    const index = this.coloresSeleccionados.findIndex(color => cod === color.cod_color && color.cod_categoria === this.producto.cod_categoria);
    console.log(index);

    if (index !== -1) {
      this.coloresSeleccionados[index].cantidad = parseInt(cantidad);
      console.log('Cantidad actualizada:', this.coloresSeleccionados[index]);
    } else {
      console.log('No se encontró ningún color con el código', cod);
    }
    console.log(this.coloresSeleccionados);
  }

  eliminarColor(cod: any) {
    //console.log('Eliminar color con código:', cod);

    const index = this.coloresSeleccionados.findIndex(color => cod === color.cod_color);

    if (index !== -1) {
      this.coloresSeleccionados.splice(index, 1);
      this.coloresMostrar.splice(index, 1);
      // console.log('Color eliminado.');
    } else {
      // console.log('No se encontró ningún color con el código', cod);
    }

    //console.log(this.coloresSeleccionados);

  }

  continuar() {
    // console.log(this.coloresSeleccionados.length, 'longitudd');

    if (this.coloresSeleccionados.length == 0) {
      //  console.log('holaa');

      Swal.fire({
        icon: 'warning',
        text: 'No ha seleccionado ningún color. ¿Está seguro de volver al catálago?',
        confirmButtonText: 'Si',
        confirmButtonColor: '#28B463',
        showConfirmButton: true,
        cancelButtonColor: '#E74C3C',
        cancelButtonText: 'No',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/catalog'])
        }
      });
    } else {
      /* const productoString = JSON.stringify(this.coloresSeleccionados);
      const producto2 = productoString.slice(1, -1);
      localStorage.setItem('productos', JSON.stringify(producto2)); */
      localStorage.setItem('productos', JSON.stringify(this.coloresSeleccionados));
      this.router.navigate(['/catalog']);
    }
  }

  finalizarOrden() {
    if (this.coloresSeleccionados.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'No ha seleccionado ningún producto.',
        text: 'Si no desea continuar con la orden en proceso, por favor cancele la orden.'
      });
    } else {
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
              condicion: cliente.Condicion,
              tipo_envio: cliente.tipo_envio,
              email: cliente.email,
              correo: true
            };
          } else {
            console.error('El objeto cliente almacenado en localStorage es nulo.');
          }
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
                detalle: this.coloresSeleccionados
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
                detalle: this.coloresSeleccionados
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
          })
        }
      });
    }
  }
}
