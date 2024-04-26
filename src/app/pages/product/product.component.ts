import { HttpBackend, HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OtherService } from 'src/app/services/other.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  cod: any;
  orden: any;
  listaColores: any;
  producto: any;
  colores: any[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef, private service: OtherService) { }
  ngOnInit(): void {
    this.service.setOrden();
    this.service.orden$.subscribe(data => {
      this.orden = data;
    });

    this.route.params.subscribe(params => {
      this.cod = params['cod'];
      this.consultarProducto(this.cod);
    });
    console.log(this.colores, 'es estooo');

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
        console.log(this.producto);

        this.cdr.detectChanges();
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

    console.log(data);


    this.http.post(`${environment.BASE_URL_API}/listarColores`, data).subscribe(
      (response: any) => {
        console.log(response);

        if (response !== 'VACIO') {
          this.listaColores = response.map((dato: any) => ({ value: dato.codigo_color, label: dato.descripcion_color }));
          //this.listaColores = [{ value: response.codigo_color, label: response.descripcion_color }]
          console.log(this.listaColores);

        } else {
          console.log('Error');
        }
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
  }

  nuevoColor(event: any) {
    const value = event?.target?.value;
    console.log(value);

    if (value) {
      const colorSeleccionado = this.listaColores.find((color:any) => value == color.value);

      if (colorSeleccionado) {
        this.colores.push(colorSeleccionado);
      } else {
        console.log('No se ha seleccionado ningún color.');
      }
    }
  }


}
