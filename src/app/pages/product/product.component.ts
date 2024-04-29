import { HttpBackend, HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtherService } from 'src/app/services/other.service';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';

interface Color {
  value: string,
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
  //colores: any[] = [];
  coloresSeleccionados: { genero: string, color: Color, cantidad: number }[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef, private service: OtherService, private router: Router) { }
  ngOnInit(): void {
    this.service.setOrden();
    this.service.orden$.subscribe(data => {
      this.orden = data;
    });

    this.route.params.subscribe(params => {
      this.cod = params['cod'];
      this.consultarProducto(this.cod);
    });
  }

  consultarProducto(cod: any) {
    const data = { "Condicion": this.orden.Condicion, "Envio": this.orden.tipo_envio, "Codigo": cod };
    this.http.post(`${environment.BASE_URL_API}/listarProductoIndividual`, data).subscribe(
      (response: any) => {
        if (response !== 'VACIO') {
          this.producto = response[0];
        } else {
          console.log('Error');
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

    console.log(this.generoSeleccionado, 'es estoo');


    this.http.post(`${environment.BASE_URL_API}/listarColores`, data).subscribe(
      (response: any) => {
        if (response !== 'VACIO') {
          this.listaColores = response.map((dato: any) => ({ value: dato.codigo_color, label: dato.descripcion_color }));
        } else {
          console.log('Error');
        }
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
  }

  nuevoColor(event: any) {
    const value = event?.target?.value;
    console.log(value, 'valorrr');
    console.log(this.generoSeleccionado, 'generooo');

    if (value && this.generoSeleccionado) {
      const colorSeleccionado = this.listaColores.find(color => value == color.value);
      if (colorSeleccionado) {
        this.coloresSeleccionados.push({
          genero: this.generoSeleccionado,
          color: colorSeleccionado,
          cantidad: 0
        });
        console.log(this.coloresSeleccionados);
      } else {
        console.log('No se ha seleccionado ningún color.');
      }
    } else {
      console.log('No se ha seleccionado ningún color o género.');
    }
  }

  agregarCantidad(cod: any, cantidad: any) {
    const index = this.coloresSeleccionados.findIndex(color => cod === color.color.value);

    if (index !== -1) {
      this.coloresSeleccionados[index].cantidad = parseInt(cantidad);
      console.log('Cantidad actualizada:', this.coloresSeleccionados[index]);
    } else {
      console.log('No se encontró ningún color con el código', cod);
    }
    console.log(this.coloresSeleccionados);
  }

  eliminarColor(cod: any) {
    console.log('Eliminar color con código:', cod);

    const index = this.coloresSeleccionados.findIndex(color => cod === color.color.value);

    if (index !== -1) {
      this.coloresSeleccionados.splice(index, 1);
      console.log('Color eliminado.');
    } else {
      console.log('No se encontró ningún color con el código', cod);
    }

    console.log(this.coloresSeleccionados);

  }

  continuar() {
    console.log(this.coloresSeleccionados.length, 'longitudd');

    if (this.coloresSeleccionados.length == 0) {
      console.log('holaa');

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
              localStorage.removeItem('orden');
              this.router.navigate(['/home']);
            }
          })
        }
      });
    }
  }
}
