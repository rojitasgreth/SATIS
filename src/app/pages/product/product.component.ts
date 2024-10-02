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
  cliente : any;
  //colores: any[] = [];
  colorSeleccionado: any;
  coloresSeleccionados: { genero: string, categoria_producto: string, descripcion_producto: string, cantidad_piezas: string, precio: string, cod_color: number, color: string, cantidad: number, cod_categoria: string, img: string }[] = [];
  coloresMostrar: { genero: string, color: Color, cantidad: number }[] = [];
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

  verificarCliente(){
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
          console.log(response, 'producto');

          this.producto = response[0];


          ///CARRUSEL
          if (this.producto.cod_categoria == "ALMB1" || this.producto.cod_categoria == "ALMB2" || this.producto.cod_categoria == "ALMB3") {
            this.slides = [
              { src: '../../../assets/catalago/almillas0-6.jpg', title: 'Slide 1' },
              { src: '../../../assets/catalago/almillas6-9.jpg', title: 'Slide 2' },
              { src: '../../../assets/catalago/almillas9-12.jpg', title: 'Slide 3' },
              { src: '../../../assets/catalago/almillas.jpg', title: 'Slide 4' },
              { src: '../../../assets/catalago/almillas2.jpg', title: 'Slide 5' },
              { src: '../../../assets/catalago/almillas3.jpg', title: 'Slide 6' },
              { src: '../../../assets/catalago/almillas4.jpg', title: 'Slide 7' }
            ];
          } else if (this.producto.cod_categoria == "BODB1") {
            this.slides = [
              { src: '../../../assets/catalago/body.jpg', title: 'Slide 1' },
              { src: '../../../assets/catalago/body2.jpg', title: 'Slide 2' },
              { src: '../../../assets/catalago/bodyNina.jpg', title: 'Slide 3' },
              { src: '../../../assets/catalago/bodyNina2.jpg', title: 'Slide 4' }
            ];
          } else if (this.producto.cod_categoria == "CPDB1") {
            this.slides = [
              { src: '../../../assets/catalago/conjunto.jpg', title: 'Slide 1' },
              { src: '../../../assets/catalago/conjunto2.jpg', title: 'Slide 2' },
              { src: '../../../assets/catalago/conjunto4.jpg', title: 'Slide 4' },
              { src: '../../../assets/catalago/conjunto5.jpg', title: 'Slide 5' },
              { src: '../../../assets/catalago/conjuntoh.jpg', title: 'Slide 6' },
              { src: '../../../assets/catalago/conjuntoh2.jpg', title: 'Slide 7' },
              { src: '../../../assets/catalago/conjuntoh3.jpg', title: 'Slide 8' },
              { src: '../../../assets/catalago/conjuntoh4.jpg', title: 'Slide 9' },
              { src: '../../../assets/catalago/conjuntoh5.jpg', title: 'Slide 10' },
              { src: '../../../assets/catalago/conjuntoh6.jpg', title: 'Slide 11' },
            ];
          } else  if (this.producto.cod_categoria == "MONB1") {
            this.slides = [
              { src: '../../../assets/catalago/monoTradicional.jpg', title: 'Slide 1' },
              { src: '../../../assets/catalago/monoTradicional2.jpg', title: 'Slide 2' },
              { src: '../../../assets/catalago/monoTradicional3.jpg', title: 'Slide 3' },
              { src: '../../../assets/catalago/monoTradicional4.jpg', title: 'Slide 4' }
            ];
          } else {
            this.slides = [
              { src: '../../../assets/catalago/prueba.jpeg', title: 'Slide 1' }
            ];
          }
          ///FIN CARRUSEL

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
          cod_categoria: this.producto.cod_categoria,
          img: this.producto.img
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

  agregarCantidad(cod: any, cantidad: any, genero: any) {
    console.log(cod, cantidad, 'esto se recibe');

    console.log(this.producto);

    console.log(this.coloresSeleccionados);


    const index = this.coloresSeleccionados.findIndex(color => cod === color.cod_color && color.cod_categoria === this.producto.cod_categoria && genero === color.genero);
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
      console.log(this.coloresSeleccionados, 'coloresss');

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

              console.log(data);


              this.http.post(`${environment.BASE_URL_API}/insertarOrden`, data).subscribe(
                (response: any) => {
                  if (response == 'Insercion correcta') {
                    console.log(response);
                    localStorage.removeItem('orden');
                    localStorage.removeItem('productos');
                    this.router.navigate(['/home']);

                  } else {
                    Swal.fire({
                      title: "Ha ocurrido un inconveniente",
                      icon: "warning",
                      showConfirmButton: false,
              timer: 3000
                    })
                    console.log('Error');
                  }
                },
                (error: any) => {
                  Swal.fire({
                    title: "Ha ocurrido un inconveniente",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 3000
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
