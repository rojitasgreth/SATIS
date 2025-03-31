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
  cliente: any;
  //colores: any[] = [];
  colorSeleccionado: any;
  coloresSeleccionados: { genero: string, categoria_producto: string, descripcion_producto: string, cantidad_piezas: string, precio: string, cod_color: number, color: string, cantidad: number, cod_producto: string, img: string }[] = [];
  coloresMostrar: { genero: string, color: Color, cantidad: number, cod_producto: string }[] = [];
  slides: any[] = [];
  currentSlide = 0;
  constructor(private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef, private service: OtherService, private router: Router) { }
  ngOnInit(): void {
    this.service.setOrden();
    this.verificarCliente();
    this.service.orden$.subscribe(data => {
      this.orden = data;
    });
    this.cargarProductosSeleccionados();
    this.route.params.subscribe(params => {
      this.cod = params['cod'];
      this.consultarProducto(this.cod);
    });
  }
  prevSlide() {
    this.currentSlide = (this.currentSlide > 0) ? this.currentSlide - 1 : this.slides.length - 1;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide < this.slides.length - 1) ? this.currentSlide + 1 : 0;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  verificarCliente() {
    const clienteString = localStorage.getItem('orden');
    const infoString = localStorage.getItem('info')
    if (clienteString !== null && infoString !== null) {
      this.cliente = JSON.parse(clienteString);
    }
  }
  cargarProductosSeleccionados() {
    const productosString = localStorage.getItem('productos');
    if (productosString) {
      this.coloresSeleccionados = JSON.parse(productosString);
    }
  }

  consultarProducto(cod: any) {
    let form = JSON.parse(this.orden);
    const data = { "Condicion": form.Condicion, "Envio": form.tipo_envio, "Codigo": cod };
    this.http.post(`${environment.BASE_URL_API}/listarProductoIndividual`, data).subscribe(
      (response: any) => {
        if (response !== 'VACIO') {
          //console.log(response, 'producto');

          this.producto = response.data[0];
          //console.log(this.producto);

          const imagenes = response.imagenes;
          //console.log(imagenes);


          for (let img of imagenes) {
            //console.log(img, 'es estooo');

            this.slides.push({ src: img.imagen, title: 'Carrusel de fotos' });
          }
          //console.log(this.slides, 'final');
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
      "cod_producto": cod,
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

      if (this.colorSeleccionado) {
        // console.log(this.cliente);
        let cantidadPorDefecto = 0;
        if (this.cliente.Condicion == 'Distribuidor') {
          cantidadPorDefecto = this.obtenerCantidadPorDefecto(this.producto.cod_producto);
        }

        this.coloresSeleccionados.push({
          genero: this.generoSeleccionado,
          categoria_producto: this.producto.categoria,
          descripcion_producto: this.producto.descripcion,
          cantidad_piezas: this.producto.cantidad_piezas,
          precio: this.producto.precio,
          cod_color: this.colorSeleccionado.value,
          color: this.colorSeleccionado.label,
          cantidad: cantidadPorDefecto,
          cod_producto: this.producto.cod_producto,
          img: this.producto.img
        });

        this.coloresMostrar.push({
          genero: this.generoSeleccionado,
          color: this.colorSeleccionado,
          cantidad: cantidadPorDefecto,
          cod_producto: this.producto.cod_producto
        });

        this.agregarCantidad(this.colorSeleccionado.value, cantidadPorDefecto, this.generoSeleccionado);

        // console.log(this.coloresSeleccionados, 'este es el color seleccionado');
      } else {
        // console.log('No se ha seleccionado ningún color.');
      }
    } else {
      // console.log('No se ha seleccionado ningún color o género.');
    }
  }

  obtenerCantidadPorDefecto(codCategoria: string): number {
    switch (codCategoria) {
      case 'ALMB1':
      case 'JSCO1':
      case 'JSCU1':
        return 100;
      case 'ALMB2':
      case 'ALMB3':
      case 'SEMB1':
        return 25;
      case 'BODB1':
      case 'BODB2':
      case 'CPDB1':
      case 'GTRI1':
      case 'MONB1':
      case 'MONB2':
      case 'MONB3':
      case 'MCUA1':
      case 'FTRI1':
        return 50;
      default:
        return 0;
    }
  }


  agregarCantidad(cod: any, cantidad: any, genero: any) {
    //console.log(this.coloresSeleccionados, ' colores agregados');

    const index = this.coloresSeleccionados.findIndex(color => cod === color.cod_color && color.cod_producto === this.producto.cod_producto && genero === color.genero);
    // console.log(index);

    if (index !== -1) {
      this.coloresSeleccionados[index].cantidad = parseInt(cantidad);
    }
  }

  eliminarColor(cod: any, cod_producto: string) {
    //console.log(this.coloresMostrar, 'antes mostrar');
    //console.log(this.colorSeleccionado, 'antes seleccionado');
    //console.log('Eliminar:', cod, cod_producto);

    // Buscar y eliminar el color en coloresSeleccionados
    const indexSeleccionado = this.coloresSeleccionados.findIndex(
      color => cod === color.cod_color && cod_producto === color.cod_producto
    );

    if (indexSeleccionado !== -1) {
      this.coloresSeleccionados.splice(indexSeleccionado, 1);
    }

    // Buscar y eliminar el color en coloresMostrar
    const indexMostrar = this.coloresMostrar.findIndex(
      color => cod === color.color.value && cod_producto === color.cod_producto
    );

    if (indexMostrar !== -1) {
      this.coloresMostrar.splice(indexMostrar, 1);
    }

    //console.log('Color eliminado.');
    //console.log(this.coloresMostrar, 'despues mostrar');
    //console.log(this.coloresSeleccionados, 'despues seleccionado');

    // Detectar cambios para actualizar la vista
    this.cdr.detectChanges();
  }


  continuar() {
    //// console.log(this.coloresSeleccionados.length, 'longitudd');

    if (this.coloresSeleccionados.length == 0) {
      // // console.log('holaa');

      Swal.fire({
        icon: 'warning',
        text: 'No ha seleccionado ningún color. ¿Está seguro de volver al catálogo?',
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
      // console.log(this.coloresSeleccionados, 'coloresss');
      localStorage.removeItem('productos');
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
            //console.log(cliente);

            this.clienteFinal = {
              id_cliente: cliente.id,
              id_usuario: info.id_usuario,
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
          } else {
            console.error('El objeto cliente almacenado en localStorage es nulo.');
          }
          Swal.fire({
            icon: 'warning',
            title: '¿Esta seguro que desea finalizar la orden?',
            text: 'Verifique haber agregado todos los productos, ya que después no los podrá agregar a esta misma orden.',
            confirmButtonText: 'Si, finalizar en este momento.',
            confirmButtonColor: '#28B463',
            showConfirmButton: true,
            cancelButtonColor: '#E74C3C',
            cancelButtonText: 'No, volver.',
            showCancelButton: true
          }).then((result) => {
            if (result.isConfirmed) {

              const data = {
                cliente: this.clienteFinal,
                detalle: this.coloresSeleccionados
              }

              // console.log(data);


              this.http.post(`${environment.BASE_URL_API}/insertarOrden`, data).subscribe(
                (response: any) => {
                  if (response == 'Insercion correcta') {
                    // console.log(response);
                    localStorage.removeItem('orden');
                    localStorage.removeItem('productos');
                    this.router.navigate(['/home']);

                  } else {
                    Swal.fire({
                      title: "Ha ocurrido un inconveniente",
                      icon: "warning",
                      showConfirmButton: true,
                      confirmButtonAriaLabel: 'De acuerdo',
                      confirmButtonColor: '#0097A7',

                    })
                    // console.log('Error');
                  }
                },
                (error: any) => {
                  Swal.fire({
                    title: "Ha ocurrido un inconveniente",
                    icon: "warning",
                    showConfirmButton: true,
                    confirmButtonAriaLabel: 'De acuerdo',
                    confirmButtonColor: '#0097A7',

                  })
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
