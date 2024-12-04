import { Component, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { userModalComponent } from '../modals/users/user.modal';
import { newProductModalComponent } from '../modals/products/newProduct.modal';
import Swal from 'sweetalert2';
import { environment } from 'src/environment/environment';
import { productModalComponent } from '../modals/products/product.modal';
import { colorProductModalComponent } from '../modals/products/colorProduct.modal';
export interface UserData {
  cod_producto: string;
  categoria: string;
  descripcion: string;
  cantidad_piezas: number;
  precio: string;
  total: string;
  precio_con_envio: string;
  total_con_envio: string;
  precio_dist: string;
  total_dist: string;
  activo: boolean;
}
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent {
  displayedColumns: string[] = [
    'acciones', 'cod_producto', 'categoria', 'descripcion', 'cantidad_piezas',
    'precio', 'total', 'precio_con_envio', 'total_con_envio', 'precio_dist', 'total_dist'
  ];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource();
  usersCount: number = 0;
  productosForm: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
  ) {
    this.productosForm = this._formBuilder.group({
      cod_producto: [],
      descripcion: [],
      cantidad_piezas: [],
      precio: [],
      total: [],
      precio_con_envio: [],
      total_con_envio: [],
      precio_dist: [],
      total_dist: [],
      detalle: [],
      activo: [],
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.consultarData();
  }

  nuevoUsuario() {
    const dialogRef = this._matDialog.open(newProductModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("Compose dialog was closed!");
      if (result == 'exitoso') {
        this.consultarData();
      }

    });
    this._changeDetectorRef.detectChanges();
  }

  nuevoColor(row: any) {
    const dialogRef = this._matDialog.open(colorProductModalComponent, {
      data: row
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("Compose dialog was closed!");
      if (result == 'exitoso') {
        this.consultarData();
      }

    });
    this._changeDetectorRef.detectChanges();
  }

  editar(row: any): void {

    const dialogRef = this._matDialog.open(productModalComponent, {
      data: row
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("Compose dialog was closed!");
      if (result == 'exitoso') {
        this.consultarData();
      }

    });
    this._changeDetectorRef.detectChanges();
  }

  desactivar(row: any): void {

    Swal.fire({
      title: "¿Está seguro que desea desactivar el producto seleccionado?",
      text: `Una vez desactivado no estará disponible en el catálogo`,
      confirmButtonText: 'Si, desactivar',
      confirmButtonColor: '#0097A7',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#D32F2F',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {

        let form = { cod_producto: row.cod_producto }
        this.http.post(`${environment.BASE_URL_API}/eliminarProducto`, form).subscribe(
          (response) => {
            if (response == 'Eliminacion logica exitosa') {
              this.showSuccessMessage();
              this.consultarData();
              this._changeDetectorRef.detectChanges();
            }

          }
        )
      }
    })

  }

  activar(row: any): void {

    Swal.fire({
      title: "¿Está seguro que desea desactivar el producto seleccionado?",
      text: `Una vez desactivado no estará disponible en el catálogo`,
      confirmButtonText: 'Si, activar',
      confirmButtonColor: '#0097A7',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#D32F2F',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosForm.patchValue({
          cedula: row.cedula,
          primer_nombre: row.primer_nombre,
          segundo_nombre: row.segundo_nombre,
          primer_apellido: row.primer_apellido,
          fecha_nacimiento: row.fecha_nacimiento,
          telefono: row.telefono,
          correo: row.correo,
          usuario: row.usuario,
          clave: row.clave,
          rol: row.rol,
          estatus: ['Activo']
        });

        let form = this.productosForm.value;
        form.id = row.id;
        this.http.post(`${environment.BASE_URL_API}/modificarEmpleado`, form).subscribe(
          (response) => {
            if (response == 'Modificacion correcta') {
              this.showSuccessMessage();
              this.consultarData();
              this._changeDetectorRef.detectChanges();
            }

          }
        )
      }
    })

  }

  eliminar(row: any): void {

    Swal.fire({
      title: "¿Está seguro que desea eliminar el personal seleccionado?",
      text: `${row.primer_nombre} ${row.primer_apellido} es el usuario seleccionado`,
      confirmButtonText: 'Si, activar',
      confirmButtonColor: '#0097A7',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#D32F2F',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        let data = { id: row.id };
        this.http.post(`${environment.BASE_URL_API}/eliminarEmpleado`, data).subscribe(
          (response) => {
            if (response == 'Eliminacion exitosa') {
              this.showSuccessMessage2();
              this.consultarData();
              this._changeDetectorRef.detectChanges();
            }

          }
        )
      }
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  consultarData() {
    this.http.post(`${environment.BASE_URL_API}/listarProductosSupervisor`, {}).subscribe(
      (response: any) => {
        console.log(response);
        this.dataSource.data = response;
        //this.dataSource.paginator = this.paginator;
        this._changeDetectorRef.detectChanges();
      },
      (error: any) => {
        console.error("Error", error);
      }
    );
  }

  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Informacion actualizada exitosamente',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showSuccessMessage2() {
    Swal.fire({
      icon: 'success',
      title: 'Usuario eliminado exitosamente',
      showConfirmButton: false,
      timer: 3000
    });
  }
}
