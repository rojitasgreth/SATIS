import { Component, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environment/environment';
import { productModalComponent } from '../modals/products/product.modal';
import { colorProductModalComponent } from '../modals/products/colorProduct.modal';
import { CustomerModalComponent } from '../modals/customer/customer.modal';
import { editCustomerModal } from '../modals/customer/editCusto.modal';

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
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CustomerComponent {
  displayedColumns: string[] = [
    'acciones', 'rif', 'razon_social', 'telefono', 'correo',
    'estado', 'calle', 'edificio'
  ];
  dataSource: MatTableDataSource<UserData> = new MatTableDataSource();
  usersCount: number = 0;
  clientesForm: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private http: HttpClient,
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
  ) {
    this.clientesForm = this._formBuilder.group({
      rif: [],
      razon_social: [],
      telefono: [],
      correo: [],
      estado: [],
      calle: [],
      edificio: []
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.consultarData();
  }

  nuevoCliente() {
    const dialogRef = this._matDialog.open(CustomerModalComponent);

    dialogRef.afterClosed().subscribe((result) => {
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

    const dialogRef = this._matDialog.open(editCustomerModal, {
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
      title: "¿Está seguro que desea desactivar el cliente seleccionado?",
      text: `Podrá volverlo a activar cuando desee`,
      confirmButtonText: 'Si, desactivar',
      confirmButtonColor: '#0097A7',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#D32F2F',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {

        let form = { id_cliente: row.id }
        this.http.post(`${environment.BASE_URL_API}/eliminarCliente`, form).subscribe(
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
        this.clientesForm.patchValue({
          rif: row.rif,
          razon_social: row.razon_social,
          telefono: row.telefono,
          correo: row.correo,
          estado: row.estado,
          calle: row.calle,
          edificio: row.edificio
        });

        let form = this.clientesForm.value;
        form.id = row.id;
        form.RIF = row.rif;
        form.cliente = row.razon_social;
        form.email = row.correo;
        form.estatus = true;
        this.http.post(`${environment.BASE_URL_API}/modificarCliente`, form).subscribe(
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
    this.http.post(`${environment.BASE_URL_API}/listarClienteGeneral`, {}).subscribe(
      (response: any) => {
        if (response != 'VACIO') {
        this.dataSource.data = response;
        //this.dataSource.paginator = this.paginator;
        this._changeDetectorRef.detectChanges();
        }
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
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }

  showSuccessMessage2() {
    Swal.fire({
      icon: 'success',
      title: 'Cliente eliminado exitosamente',
      showConfirmButton: true,
      confirmButtonAriaLabel: 'De acuerdo',
      confirmButtonColor: '#0097A7',

    });
  }
}
