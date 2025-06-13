import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { OtherService } from 'src/app/services/other.service';
import Swal from 'sweetalert2';
import { distinctUntilChanged, takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit, OnDestroy {
  orden: any;
  productos: any;
  categorias: any[] = [];
  baseUrl = environment.BASE_URL_API_PLAIN;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private http: HttpClient,
    private service: OtherService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.service.setOrden();
    this.service.orden$
      .pipe(
        distinctUntilChanged(), // Solo emite si el valor es diferente al anterior
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        data = JSON.parse(data);
        this.orden = data;
        if (data !== null) {
          this.consultarProductos();
        } else {
          this.consultarProductosGeneral();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  consultarProductos() {
    const data = {
      Condicion: this.orden.Condicion,
      Envio: this.orden.tipo_envio,
    };

    //console.log(data);

    this.http
      .post(`${environment.BASE_URL_API}/listarProductos`, data)
      .subscribe(
        (response: any) => {
          if (response !== 'VACIO') {
            //console.log(response);

            this.productos = response;
            this.extraerCategorias();
          } else {
            Swal.fire({
              title: 'Error',
              icon: 'error',
              showConfirmButton: true,
              confirmButtonAriaLabel: 'De acuerdo',
              confirmButtonColor: '#0097A7',
              timer: 2000,
            });
          }
          this.cdr.detectChanges();
        },
        (error: any) => {
          console.error('Error', error);
        }
      );
  }

  consultarProductosGeneral() {
    this.http
      .post(`${environment.BASE_URL_API}/listarProductosGeneral`, '')
      .subscribe(
        (response: any) => {
          if (response !== 'VACIO') {
            this.productos = response;
            this.extraerCategorias();
          } else {
            Swal.fire({
              title: 'Error',
              icon: 'error',
              showConfirmButton: true,
              confirmButtonAriaLabel: 'De acuerdo',
              confirmButtonColor: '#0097A7',
              timer: 2000,
            });
          }
          this.cdr.detectChanges();
        },
        (error: any) => {
          console.error('Error', error);
        }
      );
  }

  extraerCategorias() {
    // console.log(this.productos);
    // Itera sobre los productos y extrae las categorías únicas
    this.productos.forEach((producto: any) => {
      if (!this.categorias.includes(producto.categoria)) {
        this.categorias.push(producto.categoria);
      }
    });
    // console.log(this.categorias);
    this.cdr.detectChanges();
  }

  filtrarProductos(categoria: string): any[] {
    return this.productos.filter(
      (producto: any) => producto.categoria === categoria
    );
  }
}
