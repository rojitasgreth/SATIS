import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { OtherService } from 'src/app/services/other.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  orden: any;
  productos: any;
  categorias: any[] = [];
  constructor(private http: HttpClient, private service: OtherService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.service.setOrden();
    this.service.orden$.subscribe(data => {
      data = JSON.parse(data);
      this.orden = data;
      this.consultarProductos();
    });

  }

  consultarProductos(){
    const data = { "Condicion": this.orden.Condicion, "Envio": this.orden.tipo_envio};

    console.log(data);

    this.http.post(`${environment.BASE_URL_API}/listarProductos`, data).subscribe(
      (response: any) => {
        if (response !== 'VACIO'){
          this.productos = response;
          this.extraerCategorias();
        } else {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            showConfirmButton: false,
            timer: 2000
          })
        }
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
  }

  extraerCategorias() {
    console.log(this.productos);
    // Itera sobre los productos y extrae las categorías únicas
    this.productos.forEach((producto:any) => {
      if (!this.categorias.includes(producto.categoria)) {
        this.categorias.push(producto.categoria);
      }
    });
    console.log(this.categorias);
    this.cdr.detectChanges();
  }

  filtrarProductos(categoria: string): any[] {
    return this.productos.filter((producto:any) => producto.categoria === categoria);
  }
}
